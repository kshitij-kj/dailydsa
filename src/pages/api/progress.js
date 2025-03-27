import { PrismaClient } from '@prisma/client';
import { getSession } from 'next-auth/react';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const progress = await prisma.userProgress.findUnique({
        where: {
          userId: session.user.id,
        },
      });
      return res.status(200).json(progress || { problems: {}, stats: { easy: 0, medium: 0, hard: 0 } });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch progress' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { problems, stats } = req.body;
      const progress = await prisma.userProgress.upsert({
        where: {
          userId: session.user.id,
        },
        update: {
          problems,
          stats,
        },
        create: {
          userId: session.user.id,
          problems,
          stats,
        },
      });
      return res.status(200).json(progress);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to save progress' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
} 