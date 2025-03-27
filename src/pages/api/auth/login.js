import { compare } from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Login request received:', req.body);
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Connect to database
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database');

    // Find user by email
    console.log('Finding user...');
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Verify password
    console.log('Verifying password...');
    const isValid = await compare(password, user.password);
    if (!isValid) {
      console.log('Invalid password');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    console.log('Generating token...');
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role || 'user',
        isVerified: user.isVerified || false,
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    console.log('Login successful');
    // Return user data and token (excluding password)
    return res.status(200).json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role || 'user',
        isVerified: user.isVerified || false,
      },
      token,
    });

  } catch (error) {
    console.error('Login error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
} 