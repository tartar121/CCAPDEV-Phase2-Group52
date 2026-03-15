// controllers/authCon.js
const User = require('../models/user');

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && user.password === password) {
            req.session.currentUser = {
                _id: user._id,
                name: user.name,
                email: user.email,
                // role: user.email.includes('.') && !user.email.includes('_') ? 'FACULTY' : 'STUDENT'
                role:  user.role   // pulled directly from DB
            };
            res.redirect('/');
        } else {
            res.render('login', { title: "Login", error: "Invalid email or password" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send("Server error");
    }
};

exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // All self-registered users are students by default (for now)
        await User.create({ name, email, password, role: 'student'  });
        res.render('login', { title: "Login", error: "Registration successful!" });
    } catch (err) {
        const msg = err.code === 11000 ? "An account with that email already exists." : "Registration failed. Please try again.";
        res.render('login', { title: "Login", error: "Registration failed." });
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
};
