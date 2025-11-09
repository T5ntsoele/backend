const { db, auth } = require('../config/firebase');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendVerificationEmail } = require('../utils/emailUtils');

exports.register = async (req, res) => {
  try {
    const { email, password, userType, name, additionalData } = req.body;
    
    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();
    
    if (userDoc.exists) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user data
    let userData = {
      email,
      password: hashedPassword,
      userType,
      name,
      isVerified: true, // No email verification required
      isApproved: userType === 'student', // Auto-approve students, others need admin approval
      createdAt: new Date()
    };

    // Add type-specific IDs
    if (userType === 'student') {
      userData.studentId = `STU${Date.now()}`;
      userData.profileComplete = false;
    } else if (userType === 'institute') {
      userData.institutionId = `INST${Date.now()}`;
      userData.isApproved = false; // Institutes need admin approval
    } else if (userType === 'company') {
      userData.companyId = `COMP${Date.now()}`;
      userData.isApproved = false; // Companies need admin approval
      userData.status = 'pending';
    }

    await userRef.set(userData);

    // Create additional records
    if (userType === 'student') {
      await db.collection('students').doc(userData.studentId).set({
        studentId: userData.studentId,
        email,
        name,
        fieldOfStudy: additionalData?.fieldOfStudy || 'General',
        academicPerformance: additionalData?.academicPerformance || 'average',
        hasTranscripts: false,
        createdAt: new Date(),
        updatedAt: new Date()
      });
    } else if (userType === 'institute') {
      await db.collection('institutions').doc(userData.institutionId).set({
        institutionId: userData.institutionId,
        email,
        name,
        location: additionalData?.location || 'Lesotho',
        description: additionalData?.description || 'Educational Institution',
        isActive: true,
        createdAt: new Date()
      });
    } else if (userType === 'company') {
      await db.collection('companies').doc(userData.companyId).set({
        companyId: userData.companyId,
        email,
        name,
        description: additionalData?.description || 'Company',
        location: additionalData?.location || 'Lesotho',
        industry: additionalData?.industry || 'General',
        isApproved: false,
        status: 'pending',
        createdAt: new Date()
      });
    }

    res.status(201).json({
      message: 'Registration successful! You can now login.',
      userId: userType === 'student' ? userData.studentId :
              userType === 'institute' ? userData.institutionId :
              userType === 'company' ? userData.companyId : null,
      needsApproval: userType !== 'student'
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { token } = req.body;
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    await db.collection('users').doc(decoded.email).update({ 
      isVerified: true,
      verifiedAt: new Date()
    });
    
    res.json({ message: 'Email verified successfully! You can now login.' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(400).json({ error: 'Invalid or expired verification token' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const userRef = db.collection('users').doc(email);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(400).json({ error: 'User not found' });
    }
    
    const user = userDoc.data();
    

    
    // Check approval status for institutes and companies
    if ((user.userType === 'institute' || user.userType === 'company') && !user.isApproved) {
      return res.status(400).json({ error: 'Account pending approval from administrator' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid password' });
    }
    
    const token = jwt.sign(
      { 
        email: user.email, 
        userType: user.userType,
        userId: user.userType === 'student' ? user.studentId : 
                user.userType === 'institute' ? user.institutionId : 
                user.userType === 'company' ? user.companyId : null
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        email: user.email,
        userType: user.userType,
        name: user.name,
        userId: user.userType === 'student' ? user.studentId : 
                user.userType === 'institute' ? user.institutionId : 
                user.userType === 'company' ? user.companyId : null
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
};