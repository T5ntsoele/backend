const express = require('express');
const router = express.Router();
const { db } = require('../config/firebase');

// Public route to get all active courses
router.get('/', async (req, res) => {
  try {
    const coursesSnapshot = await db.collection('courses')
      .where('isActive', '==', true)
      .get();
    
    const courses = [];
    
    for (const doc of coursesSnapshot.docs) {
      const course = doc.data();
      const facultyDoc = await db.collection('faculties').doc(course.facultyId).get();
      const institutionDoc = await db.collection('institutions').doc(course.institutionId).get();
      
      courses.push({
        id: doc.id,
        ...course,
        faculty: facultyDoc.data(),
        institution: institutionDoc.data()
      });
    }
    
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;