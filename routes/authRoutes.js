const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const employeeController = require('../controllers/employeeController');
const isAuthenticated = require('../middleware/authMiddleware');

// Signup
router.get('/signup', authController.signupPage);
router.post('/signup', authController.signup);

// Signin
router.get('/signin', authController.signinPage);
router.post('/signin', authController.signin);

// Dashboard - Protected
router.get('/dashboard', isAuthenticated, authController.dashboard);

// Profile - Protected
router.get('/profile', isAuthenticated, authController.profilePage);
router.post('/profile', isAuthenticated, authController.updateProfile);

// Change Password
router.get('/change-password', isAuthenticated, authController.changePasswordPage);
router.post('/change-password', isAuthenticated, authController.changePassword);

// Forgot Password
router.get('/forgot-password', authController.getForgotPassword);
router.post('/forgot-password', authController.forgotPassword);

// Verify OTP
router.get('/verify-otp', authController.getVerifyOtp);
router.post('/verify-otp', authController.verifyOtp);

// Reset Password
router.get('/reset-password', authController.getResetPassword);
router.post('/reset-password', authController.resetPassword);

// Employee Routes
router.get('/add-employee', isAuthenticated, employeeController.addEmployeePage);
router.post('/add-employee', isAuthenticated, employeeController.upload.single('image'), employeeController.addEmployee);
router.get('/view-employee', isAuthenticated, employeeController.viewEmployeePage);
router.get('/edit-employee/:id', isAuthenticated, employeeController.editEmployeePage);
router.post('/edit-employee/:id', isAuthenticated, employeeController.upload.single('image'), employeeController.editEmployee);
router.post('/delete-employee/:id', isAuthenticated, employeeController.deleteEmployee);

// Logout
router.get('/logout', authController.logout);

module.exports = router;