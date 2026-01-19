const User = require("../models/User");
const jwt = require("jsonwebtoken");

const authMiddleware = async (req, res, next) => {
  // try {
  //   const authHeader = req.headers.authorization;

  //   if (!authHeader || !authHeader.startsWith("Bearer ")) {
  //     return res.status(401).json({
  //       message: "User not authorized, no token",
  //     });
  //   }

  //   const token = authHeader.split(" ")[1];

  //   const decoded = jwt.verify(token, process.env.JWT_SECRET);

  //   console.log("DECODED ", decoded);

  //   const user = await User.findById(decoded.id).select("-password");

  //   if (!user) {
  //     return res.status(401).json({
  //       message: "User not found",
  //     });
  //   }

  //   req.user = user;
  //   next();
  // } catch (error) {
  //   return res.status(401).json({
  //     error: error.message,
  //   });
  // }
  const token = req.cookies.token; 
    if (!token) {
        return res.status(401).json({message: "Not authorized, no token"})
    }
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET); 
        console.log("Decoded user Id: ", decode.id);
        req.user = await User.findById(decode.id).select("-password"); 
        console.log(`Requesting User: ${req.user.name}`);
        next(); 
    } catch (error) {
        res.status(401)
        throw next(new Error("Not authorized, token failed"))
    }
};

module.exports = authMiddleware;
