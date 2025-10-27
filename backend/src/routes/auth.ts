import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = express.Router();

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, name, experience, skills, primarySkill, education } = req.body;

    console.log('Registration attempt for:', email);

    // Validate input
    if (!email || !password || !name) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists:', email);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = new User({
      email,
      password: hashedPassword,
      name,
      experience: experience || 'entry',
      skills: skills || [],
      primarySkill: primarySkill || '',
      education: education || ''
    });

    await user.save();
    console.log('User created successfully:', email);

    // Generate JWT
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        experience: user.experience,
        skills: user.skills,
        primarySkill: user.primarySkill
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error creating user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log('Login attempt for:', email);

    // Validate input
    if (!email || !password) {
      console.log('Missing email or password');
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.log('Invalid password for:', email);
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    console.log('Login successful for:', email);

    // Generate JWT
    const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
    const token = jwt.sign(
      { userId: user._id },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        experience: user.experience,
        skills: user.skills,
        primarySkill: user.primarySkill,
        currentRole: user.currentRole,
        targetRole: user.targetRole
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

export default router;