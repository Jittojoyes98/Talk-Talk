const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  const result = jwt.sign({ id }, process.env.SECRET_KEY, { expiresIn: "30d" });
  return result;
};
module.exports = generateToken;
