import { connectDB } from '@/lib/db';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDB();
    return res.status(200).json({ 
      message: 'Successfully connected to MongoDB',
      status: 'connected'
    });
  } catch (error) {
    console.error('MongoDB connection test failed:', error);
    return res.status(500).json({ 
      message: 'Failed to connect to MongoDB',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
      status: 'error'
    });
  }
} 