import { connectToDatabase } from '@/lib/mongodb';

export default async function handler(req, res) {
  try {
    const { db } = await connectToDatabase();
    await db.command({ ping: 1 });
    res.status(200).json({ message: 'Database connection successful!' });
  } catch (error) {
    console.error('Database connection error:', error);
    res.status(500).json({ message: 'Database connection failed' });
  }
} 