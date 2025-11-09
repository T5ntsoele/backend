class Job {
  constructor(companyId, title, description, requirements, qualifications, location, salary) {
    this.companyId = companyId;
    this.title = title;
    this.description = description;
    this.requirements = requirements || [];
    this.qualifications = qualifications || [];
    this.location = location;
    this.salary = salary;
    this.isActive = true;
    this.postedAt = new Date();
    this.createdAt = new Date();
  }
  
  toFirestore() {
    return {
      companyId: this.companyId,
      title: this.title,
      description: this.description,
      requirements: this.requirements,
      qualifications: this.qualifications,
      location: this.location,
      salary: this.salary,
      isActive: this.isActive,
      postedAt: this.postedAt,
      createdAt: this.createdAt
    };
  }
}

module.exports = Job;