const User = require('../Model/UserModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 


exports.register = async (req, res) => {
    try {
        // Check if username is provided
        if (!req.body.username) {
            return res.status(400).json({
                success: false,
                message: "Username is required."
            });
        }

        // Check if password is provided
        if (!req.body.password) {
            return res.status(400).json({
                success: false,
                message: "Password is required."
            });
        }

        const existingUser = await User.findOne({ username: req.body.username });

        if (existingUser) {
            return res.status(404).json({
                success: false,
                message: "You are already registered. Please login."
            });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10); // 10 is the saltRounds

        const userData = {
            username: req.body.username,
            password: hashedPassword,
        };

        const newUser = await User.create(userData);

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            data: newUser
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};




exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                success: false,
                message: "Both username and password are required."
            });
        }


        const user = await User.findOne({ username });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found. Please register."
            });
        } 

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: "Invalid password."
            });
        }

  
        const token = jwt.sign(
            { userId: user._id, username: user.username },
            'abhay', 
            { expiresIn: '1h' } 
        );

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
};
