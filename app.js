require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const path = require('path');
const connectDB = require('./config/db');

require('./config/passport')(passport);

const app = express();

// MongoDB Connect
connectDB();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session Setup
app.use(session({
    secret: 'adminpanel_secret',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

// Passport Initialize
app.use(passport.initialize());
app.use(passport.session());

// Flash Messages
app.use(flash());
app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Home Route
app.get('/', (req, res) => {
    res.redirect('/signin');
});

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/', authRoutes);

// Server Start
app.listen(9001, () => {
    console.log('Server running on http://localhost:9001');
});