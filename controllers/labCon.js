// controllers/labCon.js
const User = require('../models/user');
const Lab  = require('../models/lab');

exports.getDashboard = async (req, res) => {
    try {
        // Load labs from database
        const laboratories = await Lab.find().lean();

        // Load all non-technician users for the users panel
        const users = await User.find({ role: { $ne: 'technician' } }).lean();

        res.render('index', {
            title: "Dashboard",
            users,
            laboratories
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading dashboard");
    }
};
