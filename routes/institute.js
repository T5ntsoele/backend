const express = require('express');
const router = express.Router();
const instituteController = require('../controllers/instituteController');
const { verifyToken, verifyInstitute } = require('../middleware/authMiddleware');

router.use(verifyToken, verifyInstitute);

router.get('/applications', instituteController.getInstituteApplications);
router.put('/applications/:applicationId', instituteController.updateApplicationStatus);
router.post('/admissions/publish', instituteController.publishAdmissions);
router.get('/faculties', instituteController.getInstituteFaculties);
router.post('/faculties', instituteController.addInstituteFaculty);
router.post('/courses', instituteController.addInstituteCourse);

module.exports = router;