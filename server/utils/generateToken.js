const jwt = require("jsonwebtoken"); 

const generateToken = (userId, userRole, res)=>{
    const jwtToken = jwt.sign(
        {
         id: userId, 
         role: userRole 
        }, 
        process.env.JWT_SECRET, 
        {
            expiresIn: "1d"
        }
    )

    res.cookie('token', jwtToken, {
        httpOnly: true, 
        secure: true, 
        sameSite: "strict"
    } )
    return jwtToken; 

}

module.exports = generateToken; 