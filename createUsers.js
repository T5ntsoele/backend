const { db } = require('./config/firebase');
const bcrypt = require('bcryptjs');

const createDemoUsers = async () => {
  try {
    console.log('👤 Creating demo users...');

    const demoUsers = [
      // Admin Account
      {
        email: 'admin@careerplatform.com',
        password: 'admin123',
        userType: 'admin',
        name: 'System Administrator',
        isVerified: true,
        isApproved: true,
        createdAt: new Date(),
        verifiedAt: new Date()
      },
      // Institute Account - Limkokwing
      {
        email: 'institute@limkokwing.edu.ls',
        password: 'institute123',
        userType: 'institute',
        name: 'Limkokwing University',
        institutionId: 'limkokwing',
        isVerified: true,
        isApproved: true,
        createdAt: new Date(),
        verifiedAt: new Date()
      },
      // Institute Account - NUL
      {
        email: 'institute@nul.ls',
        password: 'institute123',
        userType: 'institute',
        name: 'National University of Lesotho',
        institutionId: 'nul',
        isVerified: true,
        isApproved: true,
        createdAt: new Date(),
        verifiedAt: new Date()
      },
      // Student Accounts
      {
        email: 'student1@example.com',
        password: 'student123',
        userType: 'student',
        name: 'John Molapo',
        studentId: 'STU1001',
        isVerified: true,
        isApproved: true,
        createdAt: new Date(),
        verifiedAt: new Date()
      },
      {
        email: 'student2@example.com',
        password: 'student123',
        userType: 'student',
        name: 'Mary Khali',
        studentId: 'STU1002',
        isVerified: true,
        isApproved: true,
        createdAt: new Date(),
        verifiedAt: new Date()
      },
      // Company Accounts
      {
        email: 'hr@techsolutions.ls',
        password: 'company123',
        userType: 'company',
        name: 'Tech Solutions Lesotho',
        companyId: 'company_tech',
        isVerified: true,
        isApproved: true,
        status: 'active',
        createdAt: new Date(),
        verifiedAt: new Date()
      },
      {
        email: 'careers@lfs.ls',
        password: 'company123',
        userType: 'company',
        name: 'Lesotho Financial Services',
        companyId: 'company_finance',
        isVerified: true,
        isApproved: true,
        status: 'active',
        createdAt: new Date(),
        verifiedAt: new Date()
      }
    ];

    for (const user of demoUsers) {
      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);
      
      // Create user document
      const userData = {
        ...user,
        password: hashedPassword
      };

      await db.collection('users').doc(user.email).set(userData);

      // Create student profiles for student accounts
      if (user.userType === 'student') {
        await db.collection('students').doc(user.studentId).set({
          studentId: user.studentId,
          email: user.email,
          name: user.name,
          fieldOfStudy: 'Computer Science',
          academicPerformance: 'good',
          hasTranscripts: false,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      }

      console.log(`✅ Created ${user.userType}: ${user.email}`);
    }

    console.log('\n🎉 Demo users created successfully!');
    console.log('\n📋 DEMO ACCOUNTS:');
    console.log('=====================');
    console.log('👨‍💼 Admin:');
    console.log('   Email: admin@careerplatform.com');
    console.log('   Password: admin123');
    console.log('\n🏫 Institutes:');
    console.log('   Limkokwing: institute@limkokwing.edu.ls / institute123');
    console.log('   NUL: institute@nul.ls / institute123');
    console.log('\n🎓 Students:');
    console.log('   John: student1@example.com / student123');
    console.log('   Mary: student2@example.com / student123');
    console.log('\n💼 Companies:');
    console.log('   Tech Solutions: hr@techsolutions.ls / company123');
    console.log('   LFS: careers@lfs.ls / company123');
    console.log('=====================\n');

  } catch (error) {
    console.error('❌ Error creating demo users:', error.message);
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  createDemoUsers()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = createDemoUsers;