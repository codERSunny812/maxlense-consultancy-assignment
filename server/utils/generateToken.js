const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const generateResetToken = () => {
    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    return { token, hashedToken };
};

const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role, // include role here
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d",
        }
    );
};


module.exports = {generateResetToken,generateToken};