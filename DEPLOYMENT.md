# Vercel Deployment Guide - Complete MERN on Vercel

## Prerequisites

1. **GitHub Repository** - Push your code to GitHub
2. **MongoDB Atlas** - Create a free cluster and get connection string
3. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
4. **Gmail App Password** - For email verification and password reset

---

## Step 1: Setup MongoDB Atlas

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with a password
4. Click "Network Access" → "Add IP Address" → Allow all IPs (`0.0.0.0/0`)
5. Click "Databases" → "Connect" → Copy connection string
6. Replace `<username>` and `<password>` with your credentials

---

## Step 2: Setup Gmail App Password

1. Go to [myaccount.google.com/security](https://myaccount.google.com/security)
2. Enable **2-Factor Authentication** if not enabled
3. Scroll down to "App passwords"
4. Select "Mail" and "Windows Computer" → Generate password
5. Copy the 16-character password (you'll need this later)

---

## Step 3: Push Code to GitHub

```bash
# Make sure all changes are committed
git add .
git commit -m "Ready for Vercel deployment - serverless functions"
git push origin main
```

---

## Step 4: Deploy on Vercel

### 4.1 - Go to Vercel and Import Project

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New"** → **"Project"**
4. Select your repository
5. Click **"Import"**

### 4.2 - Configure Project Settings

**Step: Configure Project**
- Root Directory: Leave blank (default) ✓
- Framework Preset: **Vite**
- Build Command: `npm install && cd server && npm install && cd ../client && npm install && npm run build`
- Output Directory: `client/dist`
- Install Command: `npm install`

### 4.3 - Add Environment Variables

Click **"Environment Variables"** and add the following:

```
MONGODB_URI = mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET = your_very_secure_random_string_here
EMAIL_USER = your_gmail@gmail.com
EMAIL_PASS = your_16_char_gmail_app_password
NODE_ENV = production
```

**How to generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4.4 - Deploy

Click **"Deploy"** and wait for the build to complete. This may take 3-5 minutes.

---

## Step 5: Get Your Vercel URLs

After deployment completes:

1. **Frontend URL**: `https://your-project-name.vercel.app` (shown on dashboard)
2. **Backend API URL**: `https://your-project-name.vercel.app/api`

Update your frontend environment variable:

### 5.1 - Update Frontend Environment Variable

1. Go to Vercel Dashboard → Your Project → **Settings**
2. Click **"Environment Variables"**
3. Find or create `VITE_BACKEND_URL`
4. Set value to: `https://your-project-name.vercel.app/api`
5. Click **Save**
6. Go back to **Deployments** and click **Redeploy** on the latest deployment

---

## Step 6: Test Your Application

1. Visit `https://your-project-name.vercel.app`
2. Test these features:
   - ✅ User Registration
   - ✅ Email Verification (OTP)
   - ✅ Login
   - ✅ Logout
   - ✅ Password Reset

Check logs if any issues:
- Go to Vercel Dashboard → Deployments → Click latest → View Function Logs

---

## API Endpoints (Now on Vercel)

All endpoints are prefixed with your Vercel URL:

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/send-verify-otp
POST   /api/auth/verify-account
GET    /api/auth/is-auth
POST   /api/auth/send-reset-otp
POST   /api/auth/reset-password
GET    /api/user/data
```

---

## Troubleshooting

### Issue: "Cannot find module" errors
- Vercel might have different paths. Check Function Logs in dashboard
- Solution: Clear build cache → Redeploy

### Issue: Email not sending
- Verify MongoDB is reachable from Vercel
- Check EMAIL_USER and EMAIL_PASS in Environment Variables
- Gmail app password must be 16 characters

### Issue: CORS errors
- Frontend and backend are now on same domain, CORS should work
- Check browser console for specific error messages

### Issue: Build failing
- Check "Build Logs" in Vercel dashboard
- Ensure all dependencies in both client and server are properly listed in package.json

---

## File Structure Created

```
project/
├── api/                          # Vercel serverless functions
│   ├── index.js
│   ├── auth/
│   │   ├── register.js
│   │   ├── login.js
│   │   └── ... (other auth routes)
│   └── user/
│       └── data.js
├── client/                       # React frontend
│   ├── src/
│   ├── vite.config.js
│   └── package.json
├── server/                       # Express logic (imported by API)
│   ├── config/
│   ├── controllers/
│   ├── models/
│   └── package.json
├── vercel.json                   # Vercel configuration
└── package.json (if needed)
```

---

## Next Steps

- **Monitor Performance**: Check Vercel Analytics dashboard
- **Setup Custom Domain**: Add your domain in Vercel project settings
- **Enable HTTPS**: Automatic with Vercel
- **Add More Features**: Everything is now on Vercel!
- Protected Routes

---

## Useful Commands

```bash
# Test frontend locally with production backend
npm run dev

# Build frontend locally
npm run build

# Preview production build
npm run preview
```

---

## Troubleshooting

**Frontend can't connect to backend:**
- Check `VITE_BACKEND_URL` in Vercel environment variables
- Ensure backend is running on Render
- Check CORS settings in backend

**Email not sending:**
- Verify Gmail app password
- Check EMAIL_USER and EMAIL_PASS in Render
- Ensure 2FA is enabled on Gmail

**Database connection error:**
- Verify MongoDB Atlas connection string
- Check if IP whitelist includes 0.0.0.0/0
- Ensure database user has correct permissions

---

## Free Tier Limits

- **Vercel:** Unlimited deployments, 100GB bandwidth/month
- **Render:** 750 hours/month (free tier), may sleep after inactivity
- **MongoDB Atlas:** 512MB storage (free tier)

**Note:** Render free tier may take 30-60 seconds to wake up after inactivity.
