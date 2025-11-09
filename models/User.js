class User {
  constructor(email, password, userType, name, additionalData = {}) {
    this.email = email;
    this.password = password;
    this.userType = userType;
    this.name = name;
    this.isVerified = false;
    this.createdAt = new Date();
    this.verifiedAt = null;
    
    // Type-specific properties
    if (userType === 'student') {
      this.studentId = `STU${Date.now()}`;
      this.profileComplete = false;
    } else if (userType === 'institute') {
      this.institutionId = `INST${Date.now()}`;
      this.isApproved = false;
    } else if (userType === 'company') {
      this.companyId = `COMP${Date.now()}`;
      this.isApproved = false;
      this.status = 'pending';
    }
    
    // Merge additional data
    Object.assign(this, additionalData);
  }
  
  toFirestore() {
    return {
      email: this.email,
      password: this.password,
      userType: this.userType,
      name: this.name,
      isVerified: this.isVerified,
      createdAt: this.createdAt,
      verifiedAt: this.verifiedAt,
      ...(this.studentId && { studentId: this.studentId, profileComplete: this.profileComplete }),
      ...(this.institutionId && { institutionId: this.institutionId, isApproved: this.isApproved }),
      ...(this.companyId && { companyId: this.companyId, isApproved: this.isApproved, status: this.status })
    };
  }
}

module.exports = User;