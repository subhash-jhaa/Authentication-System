import { sendVerifyOtp } from '../../server/controllers/authController.js';
import userAuth from '../../server/middleware/userAuth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
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

    await sendVerifyOtp(req, res);
  } catch (error) {
    console.error('Send verify OTP error:', error);
    res.status(401).json({ message: 'Unauthorized' });
  }
}
