const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { sendOtpEmail } = require('../config/mailer');

// Signup Page
exports.signupPage = (req, res) => {
    res.render('signup', { error: null });
};

// Signup
exports.signup = async (req, res) => {
    const { name, username, email, mobile, gender, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
        return res.render('signup', { error: 'Passwords do not match!' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return res.render('signup', { error: 'User already exists!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, username, email, mobile, gender, password: hashedPassword });

    req.flash('success', 'Account created successfully! Please login.');
    res.redirect('/signin');
};

// Signin Page
exports.signinPage = (req, res) => {
    const error = req.flash('error')[0] || null;
    res.render('signin', { error });
};

// Signin - Passport Login
exports.signin = (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) return next(err);
        if (!user) {
            req.flash('error', info.message);
            return res.redirect('/signin');
        }
        req.logIn(user, (err) => {
            if (err) return next(err);
            req.flash('success', 'Welcome back ' + user.name + '!');
            return res.redirect('/dashboard');
        });
    })(req, res, next);
};

// Dashboard
exports.dashboard = (req, res) => {
    res.render('dashboard', { user: req.user });
};

// Profile Page
exports.profilePage = (req, res) => {
    res.render('profile', { user: req.user });
};

// Update Profile
exports.updateProfile = async (req, res) => {
    const { name, username, mobile, gender } = req.body;

    await User.findByIdAndUpdate(req.user._id, { name, username, mobile, gender });

    req.flash('success', 'Profile updated successfully!');
    res.redirect('/profile');
};

// Change Password Page
exports.changePasswordPage = (req, res) => {
    res.render('change-password', { user: req.user });
};

// Change Password
exports.changePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
        req.flash('error', 'New passwords do not match!');
        return res.redirect('/change-password');
    }

    const user = await User.findById(req.user._id);
    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
        req.flash('error', 'Current password is wrong!');
        return res.redirect('/change-password');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(req.user._id, { password: hashedPassword });

    req.flash('success', 'Password changed successfully!');
    res.redirect('/change-password');
};

// Logout
exports.logout = (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        req.flash('success', 'Logged out successfully!');
        res.redirect('/signin');
    });
};

// ================== FORGOT PASSWORD FLOW ==================

// GET - forgot password form
exports.getForgotPassword = (req, res) => {
    const error = req.flash('error')[0] || null;
    res.render('forgot-password', { error });
};

// POST - email lekar OTP generate + mail karna
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            req.flash('error', 'Is email se koi account registered nahi hai');
            return res.redirect('/forgot-password');
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        user.resetOtp = otp;
        user.resetOtpExpiry = Date.now() + 10 * 60 * 1000; // 10 minute valid
        await user.save();

        await sendOtpEmail(user.email, otp);

        req.session.resetEmail = email;

        req.flash('success', 'OTP aapke email par bhej diya gaya hai');
        res.redirect('/verify-otp');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Kuch gadbad ho gayi, dobara try karein');
        res.redirect('/forgot-password');
    }
};

// GET - OTP verify form
exports.getVerifyOtp = (req, res) => {
    if (!req.session.resetEmail) {
        return res.redirect('/forgot-password');
    }
    const error = req.flash('error')[0] || null;
    res.render('verify-otp', { error });
};

// POST - OTP check
exports.verifyOtp = async (req, res) => {
    try {
        const { otp } = req.body;
        const email = req.session.resetEmail;

        if (!email) {
            req.flash('error', 'Session expire ho gayi, dobara try karein');
            return res.redirect('/forgot-password');
        }

        const user = await User.findOne({ email });

        if (!user || user.resetOtp !== otp) {
            req.flash('error', 'OTP galat hai');
            return res.redirect('/verify-otp');
        }

        if (Date.now() > user.resetOtpExpiry) {
            req.flash('error', 'OTP expire ho gaya hai, naya OTP mangwaein');
            return res.redirect('/forgot-password');
        }

        req.session.otpVerified = true;
        res.redirect('/reset-password');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Kuch gadbad ho gayi, dobara try karein');
        res.redirect('/verify-otp');
    }
};

// GET - naya password set karne ka form
exports.getResetPassword = (req, res) => {
    if (!req.session.resetEmail || !req.session.otpVerified) {
        return res.redirect('/forgot-password');
    }
    const error = req.flash('error')[0] || null;
    res.render('reset-password', { error });
};

// POST - naya password save karna
exports.resetPassword = async (req, res) => {
    try {
        const { password, confirmPassword } = req.body;
        const email = req.session.resetEmail;

        if (!email || !req.session.otpVerified) {
            req.flash('error', 'Session expire ho gayi, dobara try karein');
            return res.redirect('/forgot-password');
        }

        if (password !== confirmPassword) {
            req.flash('error', 'Password match nahi ho raha');
            return res.redirect('/reset-password');
        }

        const user = await User.findOne({ email });

        if (!user) {
            req.flash('error', 'User nahi mila');
            return res.redirect('/forgot-password');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetOtp = null;
        user.resetOtpExpiry = null;
        await user.save();

        req.session.resetEmail = null;
        req.session.otpVerified = null;

        req.flash('success', 'Password successfully reset ho gaya. Ab login karein');
        res.redirect('/signin');
    } catch (err) {
        console.error(err);
        req.flash('error', 'Kuch gadbad ho gayi, dobara try karein');
        res.redirect('/reset-password');
    }
};