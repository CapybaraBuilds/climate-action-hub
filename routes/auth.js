const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const generateToken = (userId) => {
    return jwt.sign(
        {userId},
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN}
    );
};

const userRegisterHandler = async(req, res) => {
    try{
        const {username, email, password} = req.body;
        if (!username || !email || !password){
            return res.status(400).json({error: "Username, E-mail, and password are required!"});
        }
        const user = await User.create({username, email, password});
        const token = generateToken(user._id);
        res.status(201).json({
            token,
            user: {id: user._id, username:user.username, email:user.email}
        });
    }catch(err){
        if(err.code === 11000){
            return res.status(400).json({error: "Username or Email already exists!"})
        }
        res.status(500).json({error: err.message});
    }
};

const userLoginHandler = async(req, res) => {
    try{
        const {email, password} = req.body;
        if (!email || !password){
            return res.status(400).json({error:"Email and password are required!"});
        }
        const user = await User.findOne({email}).select("+password");
        if(!user){
            return res.status(401).json({error:"Invalid Email or password!"});
        }
        const isMatch = await user.comparePassword(password);
        if(!isMatch){
            return res.status(401).json({error: "Invalid Email or password!"});
        }
        const token = await generateToken(user._id);
        res.status(201).json({
            token,
            user: {id: user._id, username: user.username, email:user.email}
        });
    }catch(err){
        res.status(500).json({error: err.message});
    }
}


router.post('/register', userRegisterHandler);

router.post('/login', userLoginHandler);

module.exports = router;