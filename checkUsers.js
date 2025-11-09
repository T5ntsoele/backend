const { db } = require('./config/firebase');

const checkUsers = async () => {
  try {
    console.log('🔍 Checking existing users in database...');
    
    const usersSnapshot = await db.collection('users').get();
    
    if (usersSnapshot.empty) {
      console.log('❌ No users found in database');
      return;
    }
    
    console.log('\n📋 EXISTING USERS:');
    console.log('=================');
    
    usersSnapshot.forEach(doc => {
      const user = doc.data();
      console.log(`📧 Email: ${user.email}`);
      console.log(`👤 Type: ${user.userType}`);
      console.log(`✅ Verified: ${user.isVerified}`);
      console.log(`✅ Approved: ${user.isApproved}`);
      console.log('---');
    });
    
  } catch (error) {
    console.error('Error checking users:', error);
  }
};

checkUsers();