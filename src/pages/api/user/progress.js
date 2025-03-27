import { connectDB } from '@/lib/db';
import User from '@/models/User';
import Problem from '@/models/Problem';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await connectDB();

    const user = await User.findById(session.user.id).select('solvedProblems');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Get total problems count from your problems collection
    const totalProblems = await Problem.countDocuments();

    return res.status(200).json({
      solvedProblems: user.solvedProblems,
      totalProblems
    });
  } catch (error) {
    console.error('Error fetching progress:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 