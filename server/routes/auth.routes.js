const express = require('express')
const { register,verifyEmail, authRouteInfo, loginUser, requestPasswordReset, resetPassword } = require('../controller/auth.controller')
const upload = require('../middleware/multer.middleware')
const authRouter = express.Router()


// route to get the auth route info
authRouter.get('/',authRouteInfo);

//route to register a user
authRouter.post('/register-user',upload.single('profileImage'),register);

//route to login a user 
authRouter.post('/login-user',loginUser)

//route to verify email
authRouter.get("/verify-email/:token", verifyEmail);

//route to request password reset
authRouter.post('/request-reset-password',requestPasswordReset)

//route to reset password
authRouter.post('/reset-password/:token',resetPassword)





module.exports=authRouter





