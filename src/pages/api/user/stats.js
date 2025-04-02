import { connectToDatabase } from '@/lib/mongodb';
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

    const { db } = await connectToDatabase();
    
    // Get user progress
    const userProgress = await db.collection('userProgress').findOne({
      userId: session.user.id
    });

    // Return default values if no progress found
    const defaultResponse = {
      problems: {},
      stats: {
        easy: 0,
        medium: 0,
        hard: 0,
        total: 0
      }
    };

    if (!userProgress) {
      return res.status(200).json(defaultResponse);
    }

    // Ensure the response has the correct structure
    const response = {
      problems: userProgress.problems || {},
      stats: {
        easy: userProgress.stats?.easy || 0,
        medium: userProgress.stats?.medium || 0,
        hard: userProgress.stats?.hard || 0,
        total: userProgress.stats?.total || 0
      }
    };

    return res.status(200).json(response);
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 