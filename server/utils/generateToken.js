const jwt = require("jsonwebtoken");

const generateToken = (userId, userRole, res) => {
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


   res.cookie("token", jwtToken, {
        httpOnly: true, 
        secure: true, 
        sameSite: "None", 
        maxAge: 7*24*60*60*1000
    })

  return jwtToken;
};

module.exports = generateToken;
