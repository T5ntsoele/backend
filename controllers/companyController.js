const { db } = require('../config/firebase');

exports.postJob = async (req, res) => {
  try {
    const { 
      title, 
      description, 
      requirements, 
      qualifications, 
      location, 
      salary,
      jobType,
      requiredField,
      experienceLevel 
    } = req.body;
    
    const jobRef = db.collection('jobs').doc();
    await jobRef.set({
      id: jobRef.id,
      companyId: req.user.companyId,
      title,
      description,
      requirements: requirements || [],
      qualifications: qualifications || [],
      location,
      salary,
      jobType,
      requiredField,
      experienceLevel,
      isActive: true,
      postedAt: new Date(),
      createdAt: new Date()
    });
    
    res.status(201).json({ 
      message: 'Job posted successfully',
      jobId: jobRef.id 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCompanyJobs = async (req, res) => {
  try {
    const jobsSnapshot = await db.collection('jobs')
      .where('companyId', '==', req.user.companyId)
      .get();
    
    const jobs = [];
    jobsSnapshot.forEach(doc => {
      jobs.push({ id: doc.id, ...doc.data() });
    });
    
    res.json(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getQualifiedApplicants = async (req, res) => {
  try {
    const { jobId } = req.query;

    const jobDoc = await db.collection('jobs').doc(jobId).get();
    if (!jobDoc.exists) {
      return res.status(404).json({ error: 'Job not found' });
    }

    const job = jobDoc.data();

    // Get job applications for this job
    const applicationsSnapshot = await db.collection('jobApplications')
      .where('jobId', '==', jobId)
      .where('status', '==', 'pending')
      .get();

    const qualifiedApplicants = [];

    for (const doc of applicationsSnapshot.docs) {
      const application = doc.data();
      const studentDoc = await db.collection('students').doc(application.studentId).get();

      if (studentDoc.exists) {
        const student = studentDoc.data();
        // Only include applicants ready for interview consideration (matchScore >= 70)
        if (application.matchScore >= 70) {
          qualifiedApplicants.push({
            applicationId: doc.id,
            student: student,
            matchScore: application.matchScore,
            appliedAt: application.appliedAt
          });
        }
      }
    }

    // Sort by match score
    qualifiedApplicants.sort((a, b) => b.matchScore - a.matchScore);

    res.json(qualifiedApplicants);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateJobApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const applicationRef = db.collection('jobApplications').doc(applicationId);
    const applicationDoc = await applicationRef.get();

    if (!applicationDoc.exists) {
      return res.status(404).json({ error: 'Application not found' });
    }

    const application = applicationDoc.data();

    // Check if company owns this job
    const jobDoc = await db.collection('jobs').doc(application.jobId).get();
    if (jobDoc.data().companyId !== req.user.companyId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    await applicationRef.update({
      status,
      updatedAt: new Date(),
      reviewedBy: req.user.email
    });

    // Notify student
    await db.collection('notifications').add({
      userId: application.studentId,
      userType: 'student',
      type: 'job_application_status',
      title: `Job Application Update`,
      message: `Your application for ${jobDoc.data().title} has been ${status}`,
      relatedId: applicationId,
      isRead: false,
      createdAt: new Date()
    });

    res.json({ message: 'Application status updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, description, location, industry, website, contact } = req.body;
    const companyId = req.user.companyId;

    // Update user record
    await db.collection('users').doc(req.user.email).update({
      name,
      updatedAt: new Date()
    });

    // Update company record
    await db.collection('companies').doc(companyId).update({
      name,
      description: description || '',
      location: location || '',
      industry: industry || '',
      website: website || '',
      contact: contact || '',
      updatedAt: new Date()
    });

    res.json({ message: 'Company profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
