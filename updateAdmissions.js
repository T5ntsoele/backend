const { db } = require('./config/firebase');

async function updateAdmissions() {
  try {
    const admissionsSnapshot = await db.collection('admissions').get();
    const updatePromises = [];

    admissionsSnapshot.forEach(doc => {
      const data = doc.data();
      if (!data.publishedAt) {
        updatePromises.push(doc.ref.update({
          publishedAt: new Date()
        }));
      }
    });

    await Promise.all(updatePromises);
    console.log(`Updated ${updatePromises.length} admissions with publishedAt`);
  } catch (error) {
    console.error('Error updating admissions:', error);
  }
}

updateAdmissions();
