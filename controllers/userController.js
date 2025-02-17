import userModel from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import validator from 'validator';

// Login User
const loginUser = async (req, res) => {
   const { email, password } = req.body;
   try {
      const user = await userModel.findOne({ email });
      if (!user) {
         return res.status(404).json({ success: false, message: 'User does not exist' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
         return res.status(400).json({ success: false, message: 'Invalid email or password' });
      }
      const token = generateToken(user._id);
      res.status(200).json({ success: true, token, userId: user._id });
   } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
   }
};

// Token to Encrypt data
const generateToken = (id) => {
   return jwt.sign({ id }, process.env.JWT_SECRET);
};

// Register User
const registerUser = async (req, res) => {
   const { name, email, password } = req.body;
   try {
      const existingUser = await userModel.findOne({ email });
      if (existingUser) {
         return res.status(400).json({ success: false, message: 'User already exists' });
      }

      // Validate for email and strong password
      if (!validator.isEmail(email)) {
         return res.status(400).json({ success: false, message: 'Please enter a valid email' });
      }
      if (password.length < 8) {
         return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
      }

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Add new user
      const newUser = new userModel({
         name,
         email,
         password: hashedPassword,
      });

      const user = await newUser.save();
      const token = generateToken(user._id);

      // Send both token & userId
      res.status(201).json({ success: true, token, userId: user._id });
   } catch (error) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
   }
};



export { loginUser, registerUser };