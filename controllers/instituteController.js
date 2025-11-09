const { db } = require('../config/firebase');

exports.getInstituteApplications = async (req, res) => {
  try {
    const applicationsSnapshot = await db.collection('applications')
      .where('institutionId', '==', req.user.institutionId)
      .get();
    
    const applications = [];
    
    for (const doc of applicationsSnapshot.docs) {
      const application = doc.data();
      const studentDoc = await db.collection('students').doc(application.studentId).get();
      const courseDoc = await db.collection('courses').doc(application.courseId).get();
      const facultyDoc = await db.collection('faculties').doc(courseDoc.data().facultyId).get();
      
      applications.push({
        id: doc.id,
        ...application,
        student: studentDoc.data(),
        course: courseDoc.data(),
        faculty: facultyDoc.data()
      });
    }
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;
    
    const applicationRef = db.collection('applications').doc(applicationId);
    const applicationDoc = await applicationRef.get();
    
    if (!applicationDoc.exists) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    const application = applicationDoc.data();
    
    // Check if institution owns this application
    if (application.institutionId !== req.user.institutionId) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    await applicationRef.update({
      status,
      updatedAt: new Date(),
      reviewedBy: req.user.email
    });
    
    // Create notification for student
    await db.collection('notifications').add({
      userId: application.studentId,
      userType: 'student',
      type: 'application_status',
      title: `Application Status Update`,
      message: `Your application for ${application.courseId} has been ${status}`,
      relatedId: applicationId,
      isRead: false,
      createdAt: new Date()
    });
    
    // If admitted, check for multiple admissions
    if (status === 'admitted') {
      const otherAdmissions = await db.collection('applications')
        .where('studentId', '==', application.studentId)
        .where('status', '==', 'admitted')
        .get();
      
      if (otherAdmissions.size > 1) {
        await db.collection('notifications').add({
          userId: application.studentId,
          userType: 'student',
          type: 'multiple_admissions',
          title: `Multiple Admissions`,
          message: 'You have been admitted to multiple institutions. Please choose one.',
          isRead: false,
          createdAt: new Date()
        });
      }
    }
    
    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.publishAdmissions = async (req, res) => {
  try {
    const { courseId, admissionList, publicationDate } = req.body;
    
    const admissionRef = db.collection('admissions').doc();
    await admissionRef.set({
      id: admissionRef.id,
      courseId,
      institutionId: req.user.institutionId,
      admissionList,
      publicationDate: publicationDate || new Date(),
      publishedBy: req.user.email,
      createdAt: new Date()
    });
    
    // Notify admitted students
    for (const studentId of admissionList.admitted) {
      await db.collection('notifications').add({
        userId: studentId,
        userType: 'student',
        type: 'admission_result',
        title: `Admission Result Published`,
        message: `Admission results for your application have been published. Check your dashboard for details.`,
        relatedId: admissionRef.id,
        isRead: false,
        createdAt: new Date()
      });
    }
    
    res.json({ 
      message: 'Admissions published successfully',
      admissionId: admissionRef.id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInstituteFaculties = async (req, res) => {
  try {
    const facultiesSnapshot = await db.collection('faculties')
      .where('institutionId', '==', req.user.institutionId)
      .get();
    
    const faculties = [];
    facultiesSnapshot.forEach(doc => {
      faculties.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addInstituteFaculty = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const facultyRef = db.collection('faculties').doc();
    await facultyRef.set({
      id: facultyRef.id,
      institutionId: req.user.institutionId,
      name,
      description,
      createdAt: new Date(),
      createdBy: req.user.email
    });
    
    res.status(201).json({ 
      message: 'Faculty added successfully',
      facultyId: facultyRef.id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.addInstituteCourse = async (req, res) => {
  try {
    const { facultyId, name, description, requirements, duration, credits } = req.body;

    const courseRef = db.collection('courses').doc();
    await courseRef.set({
      id: courseRef.id,
      facultyId,
      institutionId: req.user.institutionId,
      name,
      description,
      requirements: requirements || [],
      duration,
      credits,
      isActive: true,
      createdAt: new Date(),
      createdBy: req.user.email
    });

    res.status(201).json({
      message: 'Course added successfully',
      courseId: courseRef.id
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
