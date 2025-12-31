const bcrypt = require('bcryptjs'); // Import bcrypt for password hashing
const passport = require('passport'); // Import Passport for authentication
const User = require('../models/user'); // Import the User model
const { body, validationResult } = require('express-validator'); // Import validation functions

// Validation rules for user registration
exports.validateRegistration = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/).withMessage('Name can only contain letters and spaces'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please enter a valid email address')
        .normalizeEmail(),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/).withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('password2')
        .notEmpty().withMessage('Please confirm your password')
        .custom((value, { req }) => value === req.body.password).withMessage('Passwords do not match')
];

// Show the registration form
exports.showRegisterForm = (req, res) => {
    res.render('users/register', { errors: [] }); // Renders the registration form, passing an empty array for errors
};

// Register a new user
exports.registerUser = async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // If validation fails, render the form with errors
        const errorMessages = errors.array().map(err => ({ msg: err.msg }));
        return res.render('users/register', {
            errors: errorMessages,
            name: req.body.name,
            email: req.body.email,
            password: req.body.password,
            password2: req.body.password2
        });
    }

    const { name, email, password } = req.body;

    try {
        const user = await User.findOne({ email }); // Check if the email already exists in the database
        if (user) {
            return res.render('users/register', {
                errors: [{ msg: 'Email already exists' }],
                name,
                email,
                password: req.body.password,
                password2: req.body.password2
            });
        }

        // If the email is not taken, create a new User instance
        const newUser = new User({
            name: name.trim(),
            email: email.trim(),
            password
        });

        // Hash the password before saving it to the database
        const salt = await bcrypt.genSalt(10); // Generate a salt for hashing
        newUser.password = await bcrypt.hash(password, salt); // Hash the password with the salt
        await newUser.save(); // Save the new user in the database

        req.flash('success_msg', 'You are now registered and can log in'); // Flash a success message
        res.redirect('/users/login'); // Redirect to the login page
    } catch (err) {
        console.error(err); // Log any errors
        req.flash('error_msg', 'Error registering user'); // Flash an error message
        res.redirect('/users/register'); // Redirect back to the registration page in case of error
    }
};

// Show the login form
exports.showLoginForm = (req, res) => {
    res.render('users/login'); // Renders the login form view
};

// Handle user login
exports.loginUser = (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/tasks', // If authentication is successful, redirect to tasks page
        failureRedirect: '/users/login', // If authentication fails, redirect back to the login page
        failureFlash: true // Display failure messages
    })(req, res, next);
};

// Handle user logout
exports.logoutUser = (req, res, next) => {
    req.logout(function(err) { // Logs out the user
        if (err) {
            return next(err); // Handle error if logout fails
        }
        req.flash('success_msg', 'You are logged out'); // Flash a success message
        res.redirect('/users/login'); // Redirect to the login page
    });
};
