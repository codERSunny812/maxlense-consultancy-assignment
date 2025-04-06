const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

const User = require("../models/user.model");
const sendEmail = require("../config/mailer");
const generateResetToken = require("../utils/generateToken");

// Function to handle the auth route info
const authRouteInfo = (req, res) => {
    res.send("Welcome to the auth route");
};

// function to handle the registration of a user
const register = async (req, res) => {
    console.log("register function called");
    const { name, email, username, password, role } = req.body;

    console.log("Request Body:", req.body);
    const profileImage = req.file ? req.file.filename : null;

    try {
        console.log("user checking in db");
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) return res.status(400).json({ message: "User already exists" });

        console.log("user checking in db done",existingUser);

        console.log("hashing password");
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log("password hashed");

        console.log("creating user in db");
        const verificationToken = crypto.randomBytes(32).toString("hex");
        console.log("token :",verificationToken);

        const newUser = await User.create({
            username,
            role,
            name,
            email,
            password: hashedPassword,
            verificationToken,
            profileImage,
        });


        console.log("user created and stored in db");


        console.log("sending verification mail");

        const verifyUrl = `${process.env.CLIENT_URL}/verify/${verificationToken}`;

        console.log("verifyUrl :",verifyUrl);

        console.log("email verification starts")

        console.log("sending email");
        const emailHtml = `<h3>Hello ${name}</h3><p>Please verify your email by clicking on this link:</p><a href="${verifyUrl}">Verify your Email</a>`;

     
        await sendEmail({
            to: email,
            subject: "Email Verification for maxlense project",
            text: `Verify your email using this link: ${verifyUrl}`,
            html: emailHtml,
        });

        console.log("email sent");
        console.log("user registered");

        res.status(201).json({ 
            message: "User registered. Please check your email to verify." });

    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// function to handle the verification of the email 
const verifyEmail = async (req, res) => {

    console.log("verifyEmail function called");
    const { token } = req.params;
    
    console.log(token)

    try {


        const sunny = await User.findOne();

        console.log(sunny)
        console.log("checking token in db");
        const user = await User.findOne({ where: { verificationToken: token } });

         console.log("user checking in db done");
        console.log(user)


        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        user.isVerified = true;
        user.verificationToken = null;
        await user.save();

        res.status(200).json({ message: "Email verified successfully!" });

    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

// function to handle the login of a user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) return res.status(400).json({ message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        if (!user.isVerified)
            return res.status(403).json({ message: "Please verify your email first" });

        const payload = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });

        res.status(200).json({ token, user: payload });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const requestPasswordReset = async (req, res) => {
    console.log("requestPasswordReset function called");
    const { email } = req.body;

    console.log("Request Body:", req.body.email);


    try {

        console.log("checking user in db");
        const user = await User.findOne({ where: { email } });
        console.log(user)
        console.log("user checking in db done");
        if (!user) return res.status(404).json({ message: "User not found" });

        const { token, hashedToken } = generateResetToken();

        user.resetPasswordToken = hashedToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000; // 15 minutes
        await user.save();

        const resetURL = `${process.env.FRONTEND_URL}/reset-password/${token}`;
        const message = `You requested a password reset. Click the link to reset: ${resetURL}`;


        await sendEmail({
            to: email,
            subject: "Password Reset Request",
            text: message,
        });

        res.status(200).json({ message: "Reset link sent to your email" });
    } catch (err) {
        console.error("Password Reset Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;

    try {
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            where: {
                resetPasswordToken: hashedToken,
                resetPasswordExpires: { [Op.gt]: Date.now() },
            },
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired token" });

        user.password = await bcrypt.hash(newPassword, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        res.status(200).json({ message: "Password reset successful" });
    } catch (err) {
        console.error("Reset Password Error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    register,
    verifyEmail,
    authRouteInfo,
    loginUser,
    requestPasswordReset,
    resetPassword,
};
