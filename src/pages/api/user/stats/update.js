import { connectToDatabase } from '@/lib/mongodb';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);
    
    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { problemId, isSolved, difficulty } = req.body;
    
    if (!problemId || typeof isSolved !== 'boolean' || !difficulty) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const { db } = await connectToDatabase();
    
    // Get current user progress
    const userProgress = await db.collection('userProgress').findOne({
      userId: session.user.id
    });

    // Calculate new stats
    const currentStats = userProgress?.stats || {
      easy: 0,
      medium: 0,
      hard: 0,
      total: 0
    };

    const difficultyKey = difficulty.toLowerCase();
    const newStats = {
      ...currentStats,
      [difficultyKey]: Math.max(0, currentStats[difficultyKey] + (isSolved ? 1 : -1)),
      total: Math.max(0, currentStats.total + (isSolved ? 1 : -1))
    };

    // Update or insert user progress
    const result = await db.collection('userProgress').updateOne(
      { userId: session.user.id },
      {
        $set: {
          [`problems.${problemId}`]: isSolved,
          stats: newStats,
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );

    if (result.acknowledged) {
      return res.status(200).json({
        message: 'Progress updated successfully',
        stats: newStats,
        problems: {
          ...(userProgress?.problems || {}),
          [problemId]: isSolved
        }
      });
    } else {
      throw new Error('Failed to update progress');
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
} 