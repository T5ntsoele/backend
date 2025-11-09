const { admin, db } = require('../config/firebase');
const jwt = require('jsonwebtoken');

exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userRef = db.collection('users').doc(decoded.email);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    req.user = userDoc.data();
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

exports.verifyAdmin = async (req, res, next) => {
  try {
    if (req.user.userType !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }
    next();
  } catch (error) {
    res.status(403).json({ error: 'Access denied' });
  }
};

exports.verifyInstitute = async (req, res, next) => {
  try {
    if (req.user.userType !== 'institute') {
      return res.status(403).json({ error: 'Institute access required' });
    }
    next();
  } catch (error) {
    res.status(403).json({ error: 'Access denied' });
  }
};

exports.verifyStudent = async (req, res, next) => {
  try {
    if (req.user.userType !== 'student') {
      return res.status(403).json({ error: 'Student access required' });
    }
    next();
  } catch (error) {
    res.status(403).json({ error: 'Access denied' });
  }
};

exports.verifyCompany = async (req, res, next) => {
  try {
    if (req.user.userType !== 'company') {
      return res.status(403).json({ error: 'Company access required' });
    }
    next();
  } catch (error) {
    res.status(403).json({ error: 'Access denied' });
  }
};