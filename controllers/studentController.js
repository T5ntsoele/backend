const { db } = require('../config/firebase');

exports.applyForCourse = async (req, res) => {
  try {
    const { courseId, institutionId } = req.body;
    const studentId = req.user.studentId;
    
    // Check if course exists and is active
    const courseDoc = await db.collection('courses').doc(courseId).get();
    if (!courseDoc.exists || !courseDoc.data().isActive) {
      return res.status(400).json({ error: 'Course not available' });
    }
    
    // Check if already applied to 2 courses in this institution
    const existingApplications = await db.collection('applications')
      .where('studentId', '==', studentId)
      .where('institutionId', '==', institutionId)
      .where('status', 'in', ['pending', 'admitted'])
      .get();
    
    if (existingApplications.size >= 2) {
      return res.status(400).json({ 
        error: 'Maximum 2 applications per institution allowed' 
      });
    }
    
    // Check if already applied to this course
    const existingApplication = await db.collection('applications')
      .where('studentId', '==', studentId)
      .where('courseId', '==', courseId)
      .get();
    
    if (!existingApplication.empty) {
      return res.status(400).json({ error: 'Already applied to this course' });
    }
    
    // Check if student meets course requirements (simplified)
    const studentDoc = await db.collection('students').doc(studentId).get();
    const student = studentDoc.data();
    const course = courseDoc.data();
    
    // Basic qualification check (can be enhanced)
    if (!this.meetsCourseRequirements(student, course)) {
      return res.status(400).json({ error: 'You do not meet the course requirements' });
    }
    
    const applicationRef = db.collection('applications').doc();
    await applicationRef.set({
      id: applicationRef.id,
      studentId,
      courseId,
      institutionId,
      status: 'pending',
      appliedAt: new Date(),
      applicationDate: new Date()
    });
    
    res.status(201).json({ 
      message: 'Application submitted successfully',
      applicationId: applicationRef.id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.meetsCourseRequirements = (student, course) => {
  // Implement proper requirement checking logic
  // For demo, always return true
  return true;
};

exports.getStudentApplications = async (req, res) => {
  try {
    const applicationsSnapshot = await db.collection('applications')
      .where('studentId', '==', req.user.studentId)
      .get();
    
    const applications = [];
    
    for (const doc of applicationsSnapshot.docs) {
      const application = doc.data();
      const courseDoc = await db.collection('courses').doc(application.courseId).get();
      const institutionDoc = await db.collection('institutions').doc(application.institutionId).get();
      const facultyDoc = await db.collection('faculties').doc(courseDoc.data().facultyId).get();
      
      applications.push({
        id: doc.id,
        ...application,
        course: courseDoc.data(),
        institution: institutionDoc.data(),
        faculty: facultyDoc.data()
      });
    }
    
    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadTranscripts = async (req, res) => {
  try {
    const { transcriptUrl, certificates } = req.body;
    const studentId = req.user.studentId;
    
    await db.collection('students').doc(studentId).update({
      transcriptUrl,
      certificates: certificates || [],
      hasTranscripts: true,
      transcriptsUploadedAt: new Date(),
      updatedAt: new Date()
    });
    
    res.json({ message: 'Transcripts uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getJobNotifications = async (req, res) => {
  try {
    const studentDoc = await db.collection('students').doc(req.user.studentId).get();
    const student = studentDoc.data();
    
    if (!student.hasTranscripts) {
      return res.json([]);
    }
    
    const jobsSnapshot = await db.collection('jobs')
      .where('isActive', '==', true)
      .get();
    
    const matchingJobs = [];
    
    for (const doc of jobsSnapshot.docs) {
      const job = doc.data();
      const companyDoc = await db.collection('companies').doc(job.companyId).get();
      
      if (this.jobMatchesStudent(job, student) && companyDoc.data().isApproved) {
        matchingJobs.push({
          ...job,
          id: doc.id,
          company: companyDoc.data()
        });
      }
    }
    
    res.json(matchingJobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.jobMatchesStudent = (job, student) => {
  let matchScore = 0;
  
  // Academic performance matching
  if (student.academicPerformance === 'excellent') matchScore += 30;
  else if (student.academicPerformance === 'good') matchScore += 20;
  else if (student.academicPerformance === 'average') matchScore += 10;
  
  // Certificates matching
  if (student.certificates && student.certificates.length > 0) {
    matchScore += Math.min(student.certificates.length * 5, 20);
  }
  
  // Work experience matching
  if (student.workExperience) {
    matchScore += Math.min(student.workExperience * 3, 15);
  }
  
  // Field relevance (simplified)
  if (student.fieldOfStudy && job.requiredField) {
    if (student.fieldOfStudy === job.requiredField) matchScore += 35;
  }
  
  return matchScore >= 50; // Minimum 50% match
};

exports.applyForJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    const studentId = req.user.studentId;
    
    const jobDoc = await db.collection('jobs').doc(jobId).get();
    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const studentDoc = await db.collection('students').doc(studentId).get();
    const student = studentDoc.data();
    
    if (!student.hasTranscripts) {
      return res.status(400).json({ error: 'Please upload your transcripts first' });
    }
    
    // Check if already applied
    const existingApplication = await db.collection('jobApplications')
      .where('studentId', '==', studentId)
      .where('jobId', '==', jobId)
      .get();
    
    if (!existingApplication.empty) {
      return res.status(400).json({ error: 'Already applied to this job' });
    }
    
    const applicationRef = db.collection('jobApplications').doc();
    await applicationRef.set({
      id: applicationRef.id,
      studentId,
      jobId,
      companyId: jobDoc.data().companyId,
      status: 'pending',
      appliedAt: new Date(),
      matchScore: this.calculateJobMatchScore(jobDoc.data(), student)
    });
    
    res.status(201).json({ 
      message: 'Job application submitted successfully',
      applicationId: applicationRef.id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.calculateJobMatchScore = (job, student) => {
  let score = 0;

  if (student.academicPerformance === 'excellent') score += 30;
  else if (student.academicPerformance === 'good') score += 20;
  else if (student.academicPerformance === 'average') score += 10;

  if (student.certificates && student.certificates.length > 0) {
    score += Math.min(student.certificates.length * 5, 20);
  }

  if (student.workExperience) {
    score += Math.min(student.workExperience * 3, 15);
  }

  if (student.fieldOfStudy && job.requiredField) {
    if (student.fieldOfStudy === job.requiredField) score += 35;
  }

  return score;
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, fieldOfStudy, academicPerformance, workExperience, phone, address } = req.body;
    const studentId = req.user.studentId;

    // Update user record
    await db.collection('users').doc(req.user.email).update({
      name,
      updatedAt: new Date()
    });

    // Update student record
    await db.collection('students').doc(studentId).update({
      name,
      fieldOfStudy: fieldOfStudy || 'General',
      academicPerformance: academicPerformance || 'average',
      workExperience: workExperience || 0,
      phone: phone || '',
      address: address || '',
      profileComplete: true,
      updatedAt: new Date()
    });

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.uploadAdditionalDocuments = async (req, res) => {
  try {
    const { documentType, documentUrl, description } = req.body;
    const studentId = req.user.studentId;

    const studentDoc = await db.collection('students').doc(studentId).get();
    const student = studentDoc.data();

    const additionalDocuments = student.additionalDocuments || [];

    additionalDocuments.push({
      id: `DOC${Date.now()}`,
      type: documentType, // 'certificate', 'recommendation', 'portfolio', etc.
      url: documentUrl,
      description: description || '',
      uploadedAt: new Date()
    });

    await db.collection('students').doc(studentId).update({
      additionalDocuments,
      updatedAt: new Date()
    });

    res.json({ message: 'Additional document uploaded successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAdmissionsResults = async (req, res) => {
  try {
    const applicationsSnapshot = await db.collection('applications')
      .where('studentId', '==', req.user.studentId)
      .get();

    const results = [];

    for (const doc of applicationsSnapshot.docs) {
      const application = doc.data();
      const courseDoc = await db.collection('courses').doc(application.courseId).get();
      const institutionDoc = await db.collection('institutions').doc(application.institutionId).get();

      results.push({
        id: doc.id,
        courseName: courseDoc.data()?.name || 'Unknown Course',
        institutionName: institutionDoc.data()?.name || 'Unknown Institution',
        status: application.status,
        appliedAt: application.appliedAt,
        resultDate: application.resultDate || null,
        admissionLetterUrl: application.admissionLetterUrl || null,
        rejectionReason: application.rejectionReason || null
      });
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
