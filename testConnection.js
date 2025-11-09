const { db } = require('./config/firebase');

const testConnection = async () => {
  try {
    console.log('🧪 Testing Firebase connection...');
    
    // Test write
    await db.collection('test').doc('connection').set({
      message: 'Firebase connection successful!',
      timestamp: new Date()
    });
    console.log('✅ Write test passed');
    
    // Test read
    const doc = await db.collection('test').doc('connection').get();
    if (doc.exists) {
      console.log('✅ Read test passed');
      console.log('📄 Document data:', doc.data());
    }
    
    // Clean up
    await db.collection('test').doc('connection').delete();
    console.log('✅ Cleanup test passed');
    
    console.log('🎉 All Firebase tests passed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Firebase test failed:', error.message);
    process.exit(1);
  }
};

testConnection();