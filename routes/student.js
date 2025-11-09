const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { verifyToken, verifyStudent } = require('../middleware/authMiddleware');

router.use(verifyToken, verifyStudent);

router.post('/applications', studentController.applyForCourse);
router.get('/applications', studentController.getStudentApplications);
router.post('/transcripts', studentController.uploadTranscripts);
router.get('/jobs/notifications', studentController.getJobNotifications);
router.post('/jobs/apply', studentController.applyForJob);
router.put('/profile', studentController.updateProfile);
router.post('/documents', studentController.uploadAdditionalDocuments);
router.get('/admissions/results', studentController.getAdmissionsResults);

module.exports = router;