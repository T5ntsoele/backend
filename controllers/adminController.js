const { db } = require('../config/firebase');

exports.addInstitution = async (req, res) => {
  try {
    const { name, location, description, contact, website } = req.body;
    
    const institutionRef = db.collection('institutions').doc();
    await institutionRef.set({
      id: institutionRef.id,
      name,
      location,
      description,
      contact,
      website,
      isActive: true,
      createdAt: new Date(),
      createdBy: req.user.email
    });
    
    res.status(201).json({ 
      message: 'Institution added successfully',
      institutionId: institutionRef.id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInstitutions = async (req, res) => {
  try {
    const institutionsSnapshot = await db.collection('institutions').get();
    const institutions = [];
    
    institutionsSnapshot.forEach(doc => {
      institutions.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(institutions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addFaculty = async (req, res) => {
  try {
    const { institutionId, name, description } = req.body;
    
    const facultyRef = db.collection('faculties').doc();
    await facultyRef.set({
      id: facultyRef.id,
      institutionId,
      name,
      description,
      createdAt: new Date()
    });
    
    res.status(201).json({ 
      message: 'Faculty added successfully',
      facultyId: facultyRef.id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addCourse = async (req, res) => {
  try {
    const { facultyId, name, description, requirements, duration, credits } = req.body;
    
    const courseRef = db.collection('courses').doc();
    await courseRef.set({
      id: courseRef.id,
      facultyId,
      name,
      description,
      requirements: requirements || [],
      duration,
      credits,
      isActive: true,
      createdAt: new Date()
    });
    
    res.status(201).json({ 
      message: 'Course added successfully',
      courseId: courseRef.id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCompanies = async (req, res) => {
  try {
    const companiesSnapshot = await db.collection('companies').get();
    const companies = [];
    
    companiesSnapshot.forEach(doc => {
      companies.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.approveCompany = async (req, res) => {
  try {
    const { companyId } = req.params;
    
    const companyRef = db.collection('companies').doc(companyId);
    const companyDoc = await companyRef.get();
    
    if (!companyDoc.exists) {
      return res.status(404).json({ error: 'Company not found' });
    }
    
    await companyRef.update({
      isApproved: true,
      status: 'active',
      approvedAt: new Date(),
      approvedBy: req.user.email
    });
    
    // Update user record
    const company = companyDoc.data();
    await db.collection('users').doc(company.email).update({
      isApproved: true
    });
    
    res.json({ message: 'Company approved successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.suspendCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    await db.collection('companies').doc(companyId).update({
      status: 'suspended',
      suspendedAt: new Date(),
      suspendedBy: req.user.email
    });

    res.json({ message: 'Company suspended successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.activateCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    await db.collection('companies').doc(companyId).update({
      status: 'active',
      activatedAt: new Date(),
      activatedBy: req.user.email
    });

    res.json({ message: 'Company activated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSystemReports = async (req, res) => {
  try {
    const [
      usersSnapshot,
      institutionsSnapshot,
      applicationsSnapshot,
      jobsSnapshot,
      companiesSnapshot
    ] = await Promise.all([
      db.collection('users').get(),
      db.collection('institutions').get(),
      db.collection('applications').get(),
      db.collection('jobs').get(),
      db.collection('companies').get()
    ]);

    const report = {
      totalUsers: usersSnapshot.size,
      totalInstitutions: institutionsSnapshot.size,
      totalApplications: applicationsSnapshot.size,
      totalJobs: jobsSnapshot.size,
      totalCompanies: companiesSnapshot.size,
      usersByType: {
        student: 0,
        institute: 0,
        company: 0,
        admin: 0
      },
      applicationsByStatus: {
        pending: 0,
        admitted: 0,
        rejected: 0
      },
      companiesByStatus: {
        active: 0,
        pending: 0,
        suspended: 0
      }
    };

    usersSnapshot.forEach(doc => {
      const user = doc.data();
      report.usersByType[user.userType]++;
    });

    applicationsSnapshot.forEach(doc => {
      const application = doc.data();
      report.applicationsByStatus[application.status]++;
    });

    companiesSnapshot.forEach(doc => {
      const company = doc.data();
      report.companiesByStatus[company.status]++;
    });

    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update institution
exports.updateInstitution = async (req, res) => {
  try {
    const { institutionId } = req.params;
    const { name, location, description, contact, website } = req.body;

    const institutionRef = db.collection('institutions').doc(institutionId);
    const institutionDoc = await institutionRef.get();

    if (!institutionDoc.exists) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    await institutionRef.update({
      name,
      location,
      description,
      contact,
      website,
      updatedAt: new Date(),
      updatedBy: req.user.email
    });

    res.json({ message: 'Institution updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete institution
exports.deleteInstitution = async (req, res) => {
  try {
    const { institutionId } = req.params;

    const institutionRef = db.collection('institutions').doc(institutionId);
    const institutionDoc = await institutionRef.get();

    if (!institutionDoc.exists) {
      return res.status(404).json({ error: 'Institution not found' });
    }

    // Delete associated faculties and courses
    const facultiesSnapshot = await db.collection('faculties').where('institutionId', '==', institutionId).get();
    const deletePromises = [];

    facultiesSnapshot.forEach(doc => {
      deletePromises.push(doc.ref.delete());
    });

    await Promise.all(deletePromises);

    await institutionRef.delete();

    res.json({ message: 'Institution and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get faculties for an institution
exports.getFaculties = async (req, res) => {
  try {
    const { institutionId } = req.params;
    const facultiesSnapshot = await db.collection('faculties').where('institutionId', '==', institutionId).get();
    const faculties = [];

    facultiesSnapshot.forEach(doc => {
      faculties.push({ id: doc.id, ...doc.data() });
    });

    res.json(faculties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update faculty
exports.updateFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const { name, description } = req.body;

    const facultyRef = db.collection('faculties').doc(facultyId);
    const facultyDoc = await facultyRef.get();

    if (!facultyDoc.exists) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    await facultyRef.update({
      name,
      description,
      updatedAt: new Date()
    });

    res.json({ message: 'Faculty updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete faculty
exports.deleteFaculty = async (req, res) => {
  try {
    const { facultyId } = req.params;

    const facultyRef = db.collection('faculties').doc(facultyId);
    const facultyDoc = await facultyRef.get();

    if (!facultyDoc.exists) {
      return res.status(404).json({ error: 'Faculty not found' });
    }

    // Delete associated courses
    const coursesSnapshot = await db.collection('courses').where('facultyId', '==', facultyId).get();
    const deletePromises = [];

    coursesSnapshot.forEach(doc => {
      deletePromises.push(doc.ref.delete());
    });

    await Promise.all(deletePromises);

    await facultyRef.delete();

    res.json({ message: 'Faculty and associated courses deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get courses for a faculty
exports.getCourses = async (req, res) => {
  try {
    const { facultyId } = req.params;
    const coursesSnapshot = await db.collection('courses').where('facultyId', '==', facultyId).get();
    const courses = [];

    coursesSnapshot.forEach(doc => {
      courses.push({ id: doc.id, ...doc.data() });
    });

    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update course
exports.updateCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { name, description, requirements, duration, credits } = req.body;

    const courseRef = db.collection('courses').doc(courseId);
    const courseDoc = await courseRef.get();

    if (!courseDoc.exists) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await courseRef.update({
      name,
      description,
      requirements: requirements || [],
      duration,
      credits,
      updatedAt: new Date()
    });

    res.json({ message: 'Course updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.params;

    const courseRef = db.collection('courses').doc(courseId);
    const courseDoc = await courseRef.get();

    if (!courseDoc.exists) {
      return res.status(404).json({ error: 'Course not found' });
    }

    await courseRef.delete();

    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete company
exports.deleteCompany = async (req, res) => {
  try {
    const { companyId } = req.params;

    const companyRef = db.collection('companies').doc(companyId);
    const companyDoc = await companyRef.get();

    if (!companyDoc.exists) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const company = companyDoc.data();

    // Delete associated jobs and applications
    const jobsSnapshot = await db.collection('jobs').where('companyId', '==', companyId).get();
    const deletePromises = [];

    jobsSnapshot.forEach(doc => {
      deletePromises.push(doc.ref.delete());
    });

    // Delete applications for these jobs
    const applicationsSnapshot = await db.collection('applications').where('companyId', '==', companyId).get();
    applicationsSnapshot.forEach(doc => {
      deletePromises.push(doc.ref.delete());
    });

    await Promise.all(deletePromises);

    // Delete user record
    await db.collection('users').doc(company.email).delete();

    // Delete company
    await companyRef.delete();

    res.json({ message: 'Company and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const usersSnapshot = await db.collection('users').get();
    const users = [];

    usersSnapshot.forEach(doc => {
      users.push({ id: doc.id, ...doc.data() });
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update user
exports.updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, userType, isApproved } = req.body;

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    await userRef.update({
      name,
      email,
      userType,
      isApproved,
      updatedAt: new Date(),
      updatedBy: req.user.email
    });

    res.json({ message: 'User updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const userRef = db.collection('users').doc(userId);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userDoc.data();

    // Delete associated data based on user type
    if (user.userType === 'company') {
      const companySnapshot = await db.collection('companies').where('email', '==', user.email).get();
      companySnapshot.forEach(doc => {
        // This will trigger the deleteCompany logic if needed
        // For now, just delete the company record
        doc.ref.delete();
      });
    } else if (user.userType === 'institute') {
      const institutionSnapshot = await db.collection('institutions').where('contact', '==', user.email).get();
      institutionSnapshot.forEach(doc => {
        // Delete institution and associated data
        doc.ref.delete();
      });
    }

    await userRef.delete();

    res.json({ message: 'User and associated data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Publish admissions for an institution
exports.publishAdmissions = async (req, res) => {
  try {
    const { institutionId, admissionDetails } = req.body;

    const admissionRef = db.collection('admissions').doc();
    await admissionRef.set({
      id: admissionRef.id,
      institutionId,
      admissionDetails,
      isPublished: true,
      publishedAt: new Date(),
      publishedBy: req.user.email
    });

    res.status(201).json({
      message: 'Admissions published successfully',
      admissionId: admissionRef.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get published admissions
exports.getAdmissions = async (req, res) => {
  try {
    const admissionsSnapshot = await db.collection('admissions').get();
    const admissions = [];

    admissionsSnapshot.forEach(doc => {
      admissions.push({ id: doc.id, ...doc.data() });
    });

    res.json(admissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update admission
exports.updateAdmission = async (req, res) => {
  try {
    const { admissionId } = req.params;
    const { institutionId, admissionDetails } = req.body;

    const admissionRef = db.collection('admissions').doc(admissionId);
    const admissionDoc = await admissionRef.get();

    if (!admissionDoc.exists) {
      return res.status(404).json({ error: 'Admission not found' });
    }

    await admissionRef.update({
      institutionId,
      admissionDetails,
      updatedAt: new Date(),
      updatedBy: req.user.email
    });

    res.json({ message: 'Admission updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete admission
exports.deleteAdmission = async (req, res) => {
  try {
    const { admissionId } = req.params;

    const admissionRef = db.collection('admissions').doc(admissionId);
    const admissionDoc = await admissionRef.get();

    if (!admissionDoc.exists) {
      return res.status(404).json({ error: 'Admission not found' });
    }

    await admissionRef.delete();

    res.json({ message: 'Admission deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
