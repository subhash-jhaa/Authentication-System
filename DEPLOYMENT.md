# Vercel Deployment Guide

## Frontend Deployment (Client on Vercel)

### Step 1: Push to GitHub (Already Done ✓)

### Step 2: Deploy Frontend on Vercel

1. **Go to** [vercel.com](https://vercel.com)
2. **Sign in** with GitHub
3. **Click** "Add New" → "Project"
4. **Import** your repository: `Authentication-System`
5. **Configure Project:**
   - Framework Preset: **Vite**
   - Root Directory: **client**
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

6. **Add Environment Variable:**
   - Click "Environment Variables"
   - Key: `VITE_BACKEND_URL`
   - Value: `` (add this after backend deployment)

7. **Click Deploy**

---

## Backend Deployment (Server on Render)

### Step 1: Create MongoDB Atlas Database (if not done)

1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Get your connection string
4. Whitelist all IPs (0.0.0.0/0) for deployment

### Step 2: Deploy Backend on Render

1. **Go to** [render.com](https://render.com)
2. **Sign in** with GitHub
3. **Click** "New" → "Web Service"
4. **Connect** your repository: `Authentication-System`
5. **Configure:**
   - Name: `mern-auth-backend`
   - Root Directory: `server`
   - Environment: **Node**
   - Build Command: `npm install`
   - Start Command: `npm start`

6. **Add Environment Variables:**
   ```
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_random_string
   EMAIL_USER=your_gmail@gmail.com
   EMAIL_PASS=your_gmail_app_password
   CLIENT_URL=https://your-frontend.vercel.app
   ```

7. **Click Create Web Service**

### Step 3: Update Frontend Environment Variable

1. Go back to Vercel dashboard
2. Go to your project → Settings → Environment Variables
3. Update `VITE_BACKEND_URL` with your Render backend URL
4. Redeploy the frontend

---

## Gmail App Password Setup

1. Enable 2-Factor Authentication on your Google account
2. Go to Google Account → Security → 2-Step Verification
3. Scroll to "App passwords"
4. Generate an app password for "Mail"
5. Use this password in `EMAIL_PASS` environment variable

---

## Deployment Order

1. ✅ Deploy Backend first (Render)
2. ✅ Get backend URL
3. ✅ Deploy Frontend (Vercel) with backend URL
4. ✅ Test the application

---

## After Deployment

### Update CORS in server
Make sure your server allows requests from your Vercel frontend URL.

### Test Features
- User Registration
- Email Verification
- Login
- Password Reset
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
