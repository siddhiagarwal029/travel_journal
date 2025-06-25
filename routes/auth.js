const express = require('express');
const passport = require('passport');
const router = express.Router();
const User = require('../models/user');

// GET: Register Page
router.get('/register', (req, res) => {
    res.render('auth/register');
});

// POST: Register User
router.post('/register', async (req, res) => {
    const { username, password, nationality, travelStyle, favoriteContinent } = req.body;
     console.log("🔄 Registering user:", username);

    try {
        const userExists = await User.findOne({ username });
        if (userExists) {
            req.flash('error_msg', 'Username already taken!');
            return res.redirect('/register');
        }

        const newUser = new User({ username, password, nationality, travelStyle, favoriteContinent });
        await newUser.save();

        req.flash('success_msg', 'You are now registered and can log in!');
        res.redirect('/login');
    } catch (err) {
        console.error('❌ Error registering user:', err);
        req.flash('error_msg', 'Something went wrong. Try again!');
        res.redirect('/register');
    }
});

// GET: Login Page
router.get('/login', (req, res) => {
    res.render('auth/login');
});

// POST: Login User
router.post('/login', (req, res, next) => {
    console.log("🟢 Login POST triggered");

    passport.authenticate('local', {
        successRedirect: '/journals',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

// GET: Logout
router.get('/logout', (req, res) => {
    req.logout(err => {
        if (err) {
            console.error("Logout error:", err);
            req.flash('error_msg', 'Error logging out!');
            return res.redirect('/');
        }

        req.flash('success_msg', 'You are logged out');
        res.redirect('/login');
    });
});

// GET: Home page
router.get('/', (req, res) => {
    res.render('home', { user: req.user });
});

module.exports = router;
