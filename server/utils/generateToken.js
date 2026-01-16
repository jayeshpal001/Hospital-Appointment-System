const jwt = require("jsonwebtoken");

const generateToken = (userId, userRole) => {
  const jwtToken = jwt.sign(
    {
      id: userId,
      role: userRole,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );



  return jwtToken;
};

module.exports = generateToken;
