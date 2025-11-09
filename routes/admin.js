const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Apply auth middleware to all routes
router.use(verifyToken, verifyAdmin);

// Institution routes
router.post('/institutions', adminController.addInstitution);
router.get('/institutions', adminController.getInstitutions);
router.put('/institutions/:institutionId', adminController.updateInstitution);
router.delete('/institutions/:institutionId', adminController.deleteInstitution);

// Faculty routes
router.post('/faculties', adminController.addFaculty);
router.get('/institutions/:institutionId/faculties', adminController.getFaculties);
router.put('/faculties/:facultyId', adminController.updateFaculty);
router.delete('/faculties/:facultyId', adminController.deleteFaculty);

// Course routes
router.post('/courses', adminController.addCourse);
router.get('/faculties/:facultyId/courses', adminController.getCourses);
router.put('/courses/:courseId', adminController.updateCourse);
router.delete('/courses/:courseId', adminController.deleteCourse);

// Company routes
router.get('/companies', adminController.getCompanies);
router.put('/companies/:companyId/approve', adminController.approveCompany);
router.put('/companies/:companyId/suspend', adminController.suspendCompany);
router.put('/companies/:companyId/activate', adminController.activateCompany);
router.delete('/companies/:companyId', adminController.deleteCompany);

// User management routes
router.get('/users', adminController.getAllUsers);
router.put('/users/:userId', adminController.updateUser);
router.delete('/users/:userId', adminController.deleteUser);

// Admissions routes
router.post('/admissions', adminController.publishAdmissions);
router.get('/admissions', adminController.getAdmissions);
router.put('/admissions/:admissionId', adminController.updateAdmission);
router.delete('/admissions/:admissionId', adminController.deleteAdmission);

// Reports
router.get('/reports', adminController.getSystemReports);

module.exports = router;
