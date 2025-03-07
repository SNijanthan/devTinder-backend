const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, emailId, password } = req.body;

  if (!firstName || !emailId || !password) {
    throw new Error("Fields cannot be empty");
  }

  if (firstName.length < 2 || firstName.length > 30) {
    throw new Error("First name should be between 2 to 30 letterts");
  }

  if (lastName.length < 1 || lastName.length > 30) {
    throw new Error("Last name should be between 1 to 30 letterts");
  }

  if (emailId.length < 3 || emailId.length > 40) {
    throw new Error("Email Id should be between 8 to 40 letterts");
  }

  if (!validator.isEmail(emailId)) {
    throw new Error("Email is not valid");
  }

  if (!validator.isStrongPassword(password)) {
    throw new Error("Please enter strong password");
  }
};

module.exports = validateSignUpData;
