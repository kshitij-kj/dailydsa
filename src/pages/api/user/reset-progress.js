import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    await connectDB();

    const user = await User.findById(session.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid password' });
    }

    // Reset progress
    user.solvedProblems = [];
    await user.save();

    return res.status(200).json({ message: 'Progress reset successfully' });
  } catch (error) {
    console.error('Error resetting progress:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 