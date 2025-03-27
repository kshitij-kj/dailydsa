import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Signup request received:', req.body);
    const { name, email, password } = req.body;

    // Validate input
    if (!name || !email || !password) {
      console.log('Missing required fields:', { name: !!name, email: !!email, password: !!password });
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({ message: 'Please provide a valid email address' });
    }

    // Validate password strength
    if (password.length < 6) {
      console.log('Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    console.log('Attempting to connect to MongoDB...');
    await connectDB();
    console.log('Successfully connected to MongoDB');

    // Check if user already exists
    console.log('Checking for existing user with email:', email);
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    console.log('Hashing password...');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    console.log('Creating new user...');
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log('User created successfully:', user._id);

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
    };

    return res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
    });
  } catch (error) {
    console.error('Signup error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return res.status(500).json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 