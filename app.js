// app.js
const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');

const app = express();

// Controllers
const authController = require('./controllers/authCon');
const profileController = require('./controllers/profileCon');
const reservationController = require('./controllers/reservationCon');
const roomsController = require('./controllers/roomsCon');
const labController = require('./controllers/labCon');

// Database Connection
mongoose.connect('mongodb://localhost:27017/labOMine')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Connection error:', err));

// Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Setup Session
app.use(session({
    secret: 'labOMineSecretKey',
    resave: false,
    saveUninitialized: false
}));

// Make currentUser available in every template
app.use((req, res, next) => {
    res.locals.currentUser = req.session.currentUser || null;
    next();
});

// Authentication guard
function checkAuth(req, res, next) {
    if (req.session?.currentUser) return next(); // User is logged in, proceed to the route
    res.redirect('/login'); // Redirect to login page
}

// Technician guard
function checkTech(req, res, next) {
    if (req.session?.currentUser?.role === 'technician') return next();
    res.status(403).send("Access denied — technicians only.");
}

// Handlebars
app.engine("hbs", exphbs.engine({
    extname: 'hbs',
    defaultLayout: 'main',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
    helpers: {
        formatDate: function(date) {
            // Handles both YYYY-MM-DD strings and Date objects
            const d = new Date(typeof date === 'string' ? date + 'T00:00:00' : date);
            return d.toLocaleDateString('en-US', {
                weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'
            });
        },
        section(name, options) {
            if (!this._sections) this._sections = {};
            this._sections[name] = options.fn(this);
            return null;
        },
        block(name) { return this._sections?.[name] || ''; },
        capital(text) { return text ? text.toString().toUpperCase() : ''; },
        isTechnician(role) { return role === 'technician'; },
        eq(a, b) { return a === b; }
    }
}));
app.set("view engine", "hbs");
app.set("views", "./views");
app.use(express.static(__dirname + "/public"));

// ─── ROUTES ────────────────────────────────────────────────────────────────
// Authentication
app.get('/login',    (req, res) => res.render('login', { layout: 'login-layout', title: "Login" }));
app.post('/login',   authController.login);
app.post('/register', authController.register);
app.get('/logout',   authController.logout);

// Dashboard
app.get('/', checkAuth, labController.getDashboard);

// Labs & Rooms
app.get('/rooms', checkAuth, roomsController.getAvailability);

// Reservations — students & faculty
app.post('/reserve',          checkAuth, reservationController.reserve);
app.post('/reserve-multiple', checkAuth, reservationController.reserveMultiple);
app.post('/cancel-reservation', checkAuth, reservationController.cancel);

// Reservations — technician only
app.post('/tech/reserve',       checkAuth, checkTech, reservationController.techReserve);
app.post('/tech/checkin',       checkAuth, checkTech, reservationController.checkIn);
app.post('/tech/cancel-noshow', checkAuth, checkTech, reservationController.cancelNoShow);

// Profile
app.get('/profile',              checkAuth, profileController.getProfile);
app.get('/profile/:email',       checkAuth, profileController.getProfile);
app.post('/profile/update-bio',  checkAuth, profileController.updateBio);
app.post('/profile/update-photo', checkAuth, profileController.updatePhoto);
app.post('/profile/delete',      checkAuth, profileController.deleteAccount);

// Search
app.get('/search', checkAuth, (req, res) => {
    res.render('search', { title: "Search Labs" });
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
