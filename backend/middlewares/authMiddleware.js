const jwt = require('jsonwebtoken'); 
const User = require('../models/User'); 

const protect = async(req, res, next)=>{
    // let token; 
    // if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
    //     try {
    //         token = req.headers.authorization.split(" ")[1]; 
    //         const decode = jwt.verify(token, process.env.JWT_SECRET);
    //         console.log("Decoded User Id from token: ", decode.id);
    //         req.user = await User.findById(decode.id).select("-password"); 
    //         console.log("Requesting user: ", req.user.name);
    //         next(); 
    //     } catch (error) {
    //         res.status(401)
    //         throw next(new Error("Not authorized, token failed123"));
             
    //     }
    // }
    // if (!token) {
    //     return res.status(401).json({message: "Not authorized, no token"})
    // }


    const token = req.cookies.jwt; 
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
module.exports = protect; 