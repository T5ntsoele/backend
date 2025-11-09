class Application {
  constructor(studentId, courseId, institutionId) {
    this.studentId = studentId;
    this.courseId = courseId;
    this.institutionId = institutionId;
    this.status = 'pending';
    this.appliedAt = new Date();
    this.applicationDate = new Date();
    this.updatedAt = new Date();
  }
  
  toFirestore() {
    return {
      studentId: this.studentId,
      courseId: this.courseId,
      institutionId: this.institutionId,
      status: this.status,
      appliedAt: this.appliedAt,
      applicationDate: this.applicationDate,
      updatedAt: this.updatedAt
    };
  }
}

module.exports = Application;