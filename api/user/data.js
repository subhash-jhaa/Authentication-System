import { getUsersData } from '../../server/controllers/usercontroller.js';
import userAuth from '../../server/middleware/userAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Apply middleware
    await new Promise((resolve, reject) => {
      userAuth(req, res, (err) => {
        if (err) reject(err);
        resolve();
      });
    });

    await getUsersData(req, res);
  } catch (error) {
    console.error('Get user data error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
}
