const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  if (!password) {
    throw new Error("Passowrd is required");
  }
  return await bcrypt.hash(password, 10);
};

module.exports = hashPassword;
