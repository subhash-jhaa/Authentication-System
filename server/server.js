import express from 'express';
import cors from 'cors';
import  'dotenv/config';
import cookieParser from 'cookie-parser';
import connectDB from './config/mongodb.js';
import authRouter from './routes/authroutes.js';
import userRouter from './routes/userroutes.js';

const app = express();
const PORT = process.env.PORT || 4000;
connectDB();

// Middleware
app.use(cors({ 
    origin: (origin, callback) => {
        // Allow localhost and any vercel.app domain
        if (!origin || origin.includes('localhost') || origin.includes('vercel.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true 
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


//  Api Endpoints
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
