const admin = require('firebase-admin');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  try {
    const serviceAccount = require('../serviceAccountKey.json');

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`
    });
    
    console.log('✅ Firebase Admin initialized successfully');
  } catch (error) {
    console.error('❌ Error initializing Firebase Admin:', error.message);
    throw error;
  }
}

const db = admin.firestore();
const auth = admin.auth();

// Test database connection
const testConnection = async () => {
  try {
    await db.collection('test').doc('connection').set({
      test: true,
      timestamp: new Date()
    });
    console.log('✅ Firestore connection test successful');
    
    // Clean up test document
    await db.collection('test').doc('connection').delete();
  } catch (error) {
    console.error('❌ Firestore connection test failed:', error.message);
  }
};

testConnection();

module.exports = { admin, db, auth };