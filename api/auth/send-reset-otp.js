import { sendResetOtp } from '../../server/controllers/authController.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await sendResetOtp(req, res);
  } catch (error) {
    console.error('Send reset OTP error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
