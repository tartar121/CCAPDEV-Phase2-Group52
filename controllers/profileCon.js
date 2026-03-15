// controllers/profileCon.js
const User = require('../models/user');
const Reservation = require('../models/reservation');

// Get profile details for the logged-in user or another user
exports.getProfile = async (req, res) => {
    try {
        const targetEmail = req.params.email || req.session.currentUser.email;
        const profileUser = await User.findOne({ email: targetEmail }).lean();
        
        if (!profileUser) return res.status(404).send("User not found.");

        const photoUrl = profileUser.photo ||
            `https://ui-avatars.com/api/?name=${encodeURIComponent(profileUser.name)}&background=2e8b57&color=fff`;

        const isSelf = (targetEmail === req.session.currentUser.email);

        // If viewing someone else's profile, hide their anonymous reservations
        const reservationQuery = { user: profileUser._id, status: 'Active' }
        if (!isSelf) reservationQuery.isAnonymous = false

        const reservations = await Reservation.find(reservationQuery)
            .sort({ date: 1, createdAt: 1 })
            .lean();

        res.render('profile', {
            title: `${profileUser.name}'s Profile`,
            profileUser: { ...profileUser, photoUrl },
            reservations,
            isSelf
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Error loading profile.");
    }
};

// Handle updating the bio
exports.updateBio = async (req, res) => {
    try {
        const { bio } = req.body;
        await User.updateOne({ email: req.session.currentUser.email }, { bio });
        res.status(200).json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Error updating bio." });
    }
};

// Handle uploading a profile photo file
exports.updatePhoto = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ error: 'No file uploaded.' })

        // Store the public path so it can be used in <img src="...">
        const photoPath = '/uploads/' + req.file.filename
        await User.updateOne({ email: req.session.currentUser.email }, { photo: photoPath })
        res.status(200).json({ success: true, photo: photoPath })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Error updating photo.' })
    }
};

// Handle account deletion
exports.deleteAccount = async (req, res) => {
    try {
        const userId = req.session.currentUser._id;
        const email  = req.session.currentUser.email;
        // Soft-cancel all active reservations before deleting account
        await Reservation.updateMany({ user: userId, status: 'Active' }, { status: 'Cancelled' });
        await User.deleteOne({ email });
        req.session.destroy(() => res.redirect('/login'));
    } catch (err) {
        console.error(err);
        res.status(500).send("Error deleting account.");
    }
};
