const User = require("../models/User");
const bcrypt = require("bcrypt"); 
const generateToken = require("../utils/generateToken");

exports.loginController =  async (req, res) => {
    try {
        const {email, password} = req.body; 
        const user = await User.findOne({email}); 
        if (!user) {
            return res.status(400).json({
                message: "Invalid Email"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password); 
        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid Passoword"
            })
        }
       const token =  generateToken(user._id, user.role , res); 
        res.status(200).json({
            message: "Register Successfull", 
            user, 
            token
        })

    } catch (error) {
        res.status(500).json({
            message: error.message
        })
    }
}

exports.registerController =  async (req, res) => {
    try {
        const {name, email, password, role} = req.body; 
        const isExist = await User.findOne({email}); 
        if (isExist) {
            return res.status(400).json({
                message: "User Already exists, Please login"
            })
        }
       const hashedPass = await bcrypt.hash(password, 10); 
       const user = await User.create({name, email, password: hashedPass, role});   
       const token =  generateToken(user._id, user.role, res); 
        res.status(200).json({
            success: true,
            message: "Register Successfull", 
            token
        })

    } catch (error) {
        res.status(500).json({
            success: false, 
            message: error.message
        })
    }
}