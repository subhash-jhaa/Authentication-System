import bcrypt from 'bcryptjs';
import Jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';


export const register = async (req, res) => {

    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    try {

        const eistingUser = await userModel.findOne({ email: email });
        if (eistingUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new userModel({
            name,
            email,
            password: hashedPassword,
        });
        await user.save();

        const token = Jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        // sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome to Our Platform!',
            html: `<h2>Welcome to Our Platform!</h2>
                   <p>Hello <strong>${user.name}</strong>,</p>
                   <p>Thank you for registering with email: <strong>${email}</strong></p>
                   <p>We're excited to have you on board!</p>
                   <p>Best regards,<br>The Team</p>`
        };
        
        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
        }

        return res.status(201).json({success:true , message: "User registered successfully" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error in registering user", error: error.message });
    }
}

export const login = async (req, res) => {

    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }
    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid email" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid password" });
        }
        const token = Jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });
        return res.status(200).json({ success: true, message: "Login successful" });
    }
    catch (error) {
        return res.status(500).json({ message: "Error in logging in", error: error.message });
    }
}

export const logout = async (req, res) => {
    try {
         res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.status(200).json({ success: true, message: "Logout successful" });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Error in logging out", error: error.message });
    }
}

// send verification OTP to user email
export const sendVerifyOtp = async(req,res)=>{
    try {
        
        const {userId}=req.body;

        const  user = await userModel.findById(userId);

        if(user.isAccountVerified){
            return res.status(400).json({success:false,message:"Account is already verified"});
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.verifyOtp = otp;
        user.verifyOtpExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
        await user.save();

        // send otp via email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Your Account Verification OTP',
            html: `<h2>Verify your email</h2>
                   <p>Hello <strong>${user.name}</strong>,</p>
                   <p>Your OTP for account verification is: <strong style="font-size: 24px; color: #22D172;">${otp}</strong></p>
                   <p>This OTP is valid for 24 hours.</p>
                   <p>Best regards,<br>The Team</p>`
        };
        
        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return res.status(500).json({success:false,message:"Failed to send OTP email"});
        }

        return res.status(200).json({success:true,message:"OTP sent to your email"});



    } catch (error) {
        return res.status(500).json({success: false,message:error.message});
    }
}

// verify user email using otp
export const verifyEmail = async(req,res)=>{
    const {userId,otp}=req.body;

    if(!userId || !otp){
        return res.status(400).json({success:false,message:"missing details"});

    }
    try {
        const user = await userModel.findById(userId);

        if(!user){
            return res.status(400).json({success:false,message:"User not found"});
        }

        if(user.verifyOtp === '' ||user.verifyOtp !== otp){
            return res.status(400).json({success:false,message:"Invalid OTP"});
        }

        if(user.verifyOtpExpiry < Date.now()){
            return res.status(400).json({success:false,message:"OTP expired"});
        }

        user.isAccountVerified = true;
        user.verifyOtp = '';
        user.verifyOtpExpiry = null;

        await user.save();

        return res.status(200).json({success:true,message:"Account verified successfully"});

    } catch (error) {
        return res.status(500).json({success:false,message:error.message});
    }
}


// check if user is authenticated
export const isAuthenticated = async(req,res)=>{

    try {
        res.json({success:true,message:"User is authenticated"});

    } catch (error) {
        res.json({success:false,message:error.message});
    }
}

// send Password Reset OTP

export const sendResetOtp = async(req,res)=>{

    const {email}=req.body;

    if(!email){
        return res.status(400).json({success:false,message:"Email is required"});
    }
    try {
        const user = await userModel.findOne({email}); 
        if(!user){
            return res.status(400).json({success:false,message:"User not found"});
        }
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetotp = otp;
        user.resetotpExpiry = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();   

        // send otp via email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Your Password Reset OTP',
            html: `<h2>Password Reset Request</h2>
                   <p>Hello <strong>${user.name}</strong>,</p>
                   <p>Your OTP for password reset is: <strong style="font-size: 24px; color: #22D172;">${otp}</strong></p>
                   <p>This OTP is valid for 10 minutes.</p>
                   <p>Best regards,<br>The Team</p>`
        };
        
        try {
            await transporter.sendMail(mailOptions);
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            return res.status(500).json({success:false,message:"Failed to send reset OTP email"});
        }
        return res.status(200).json({success:true,message:"OTP sent to your email"});
    } catch (error) {
        return res.status(500).json({success:false,message:error.message});
    }
}

// Reaset user Password using OTP
export const resetPassword = async(req,res)=>{
    const {email,otp,newPassword}=req.body;

    if(!email || !otp || !newPassword){
        return res.status(400).json({success:false,message:"All fields are required"});
    }

    try {
        
        const user = await userModel.findOne({email});

        if(!user){
            return res.status(400).json({success:false,message:"User not found"});
        }
        if(!user.resetotp || user.resetotp !== otp){
            return res.status(400).json({success:false,message:"Invalid OTP"});
        }   
        if(user.resetotpExpiry < Date.now()){
            return res.status(400).json({success:false,message:"OTP expired"});
        }
        const hashedPassword = await bcrypt.hash(newPassword,10);

        user.password = hashedPassword;
        user.resetotp = '';
        user.resetotpExpiry = 0;

        await user.save();

        return res.status(200).json({success:true,message:"Password reset successful"});


    } catch (error) {
        return res.status(500).json({success:false,message:error.message});
    }
}