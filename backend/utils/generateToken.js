const jwt = require('jsonwebtoken');

const genrateToken = (res, userId)=>{
    const token = jwt.sign(
        {id: userId},         // Token payload: user Id   means user id store in payload
        process.env.JWT_SECRET, // Secret key to assign the token
        {expiresIn: "7d"} 
    ); 
    res.cookie('jwt', token, {
        httpOnly: true, 
        secure: true, 
        sameSite: "none", 
        maxAge: 7*24*60*60*1000
    }); 
    // return token; 
}; 

module.exports = genrateToken; 