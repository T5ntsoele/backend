const { db } = require('./config/firebase');

const resetDatabase = async () => {
  try {
    console.log('🔄 Resetting database...');
    
    // List of collections to reset (be careful with this!)
    const collections = ['users', 'students', 'applications', 'jobApplications', 'notifications'];
    
    for (const collectionName of collections) {
      const snapshot = await db.collection(collectionName).get();
      const batch = db.batch();
      
      snapshot.docs.forEach(doc => {
        batch.delete(doc.ref);
      });
      
      await batch.commit();
      console.log(`✅ Cleared collection: ${collectionName}`);
    }
    
    console.log('🎉 Database reset completed!');
    console.log('💡 Run "npm run setup-all" to recreate demo data');
    
  } catch (error) {
    console.error('❌ Error resetting database:', error.message);
  }
};

if (require.main === module) {
  resetDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}