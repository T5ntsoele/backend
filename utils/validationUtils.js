exports.validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

exports.validatePassword = (password) => {
  return password.length >= 6;
};

exports.validateUserType = (userType) => {
  const validTypes = ['student', 'institute', 'company', 'admin'];
  return validTypes.includes(userType);
};

exports.validateApplicationData = (data) => {
  const { courseId, institutionId } = data;
  return courseId && institutionId;
};

exports.validateJobData = (data) => {
  const { title, description, location, salary } = data;
  return title && description && location && salary;
};