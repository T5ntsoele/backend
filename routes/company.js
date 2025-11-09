const express = require('express');
const router = express.Router();
const companyController = require('../controllers/companyController');
const { verifyToken, verifyCompany } = require('../middleware/authMiddleware');

router.use(verifyToken, verifyCompany);

router.post('/jobs', companyController.postJob);
router.get('/jobs', companyController.getCompanyJobs);
router.get('/applicants', companyController.getQualifiedApplicants);
router.put('/applications/:applicationId', companyController.updateJobApplicationStatus);
router.put('/profile', companyController.updateProfile);

module.exports = router;