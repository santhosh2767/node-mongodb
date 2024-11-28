const User = require('../models/User');
const generateToken = require('../jwt/generateToken')
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).send({status:400,message:"Username already registered"});
        }
        const user = new User({ username, email, password });
        await user.save();
        const token = generateToken(user._id)        
        res.status(201).json({message:"User registered successfully",Token:token});
    } catch (error) {
     res.status(500).send("Server error");
    }
};

const loginUser = async (req, res) => {
    const { username, token } = req.body;

    try {
        const user = await User.findOne({ username});
        if (!user) {
            return res.status(400).send("Invalid username or Token");
        }        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (decoded.id === user._id.toString()) {
            return res.status(200).send('Login Successful');
        } else {
            return res.status(400).send('Invalid username or token');
        }
    } catch (error) {
        res.status(400).send('Invalid username or token');
    }

};


const listUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send("Server error");
    }
};

module.exports = { registerUser, loginUser, listUsers };
