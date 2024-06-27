const express = require('express');
const AuthController = require('../../controller/api/authController');
var verifyToken = require('../../middleware/auth/verifyToken');
const router = new express.Router();

const api_url = '/api/v1/auth'

/// add User route
router.post(`${api_url}/add`, AuthController.Register_User);
// login user route
router.post(`${api_url}/login`, AuthController.Login_User);
// Forget Password
router.post(`${api_url}/forget-password`, AuthController.forgetPassword);
// Verify OTP
router.post(`${api_url}/verify-otp`, AuthController.verifyOTP);


module.exports = router