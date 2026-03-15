// controllers/authCon.js
const User = require('../models/user');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email }).lean();
        if (user && user.password === password) {
            req.session.currentUser = {
                _id:   user._id,
                name:  user.name,
                email: user.email,
                role:  user.role
            };

            // Remember me -> extend session to 3 weeks, reset on each visit
            if (req.body.rememberMe) {
                req.session.cookie.maxAge = 21 * 24 * 60 * 60 * 1000  // 3 weeks in ms
            } else {
                req.session.cookie.expires = false  // browser session only
            }

            res.redirect('/');
        } else {
            res.render('login', { layout: 'login-layout', title: "Login", error: "Invalid email or password." });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        // Only allow student or faculty self-registration — technician is staff only
        const allowedRoles = ['student', 'faculty']
        const assignedRole = allowedRoles.includes(role) ? role : 'student'
        await User.create({ name, email, password, role: assignedRole });
        res.render('login', { layout: 'login-layout', title: "Login", success: "Registration successful! Please log in." });
    } catch (err) {
        const msg = err.code === 11000 ? "An account with that email already exists." : "Registration failed. Please try again.";
        res.render('login', { layout: 'login-layout', title: "Login", error: msg });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};
