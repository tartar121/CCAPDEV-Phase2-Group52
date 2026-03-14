// controllers/reservationCon.js
const Reservation = require('../models/reservation');

// Handle creating a single reservation
exports.reserve = async (req, res) => {
    try {
        const { room, date, slotIndex, slotTime, isAnonymous } = req.body;
        await Reservation.create({
            room, date, slotIndex, slotTime, isAnonymous,
            user: req.session.currentUser._id,
            userRole: req.session.currentUser.role
        });
        res.redirect(`/rooms?lab=${room}`);
    } catch (err) {
        res.status(500).send("Error creating reservation.");
    }
};

// Handle bulk reservation (for the selected slots)
exports.reserveMultiple = async (req, res) => {
    try {
        const { selections, isAnon } = req.body;
        
        // Map the selections to your database schema
        const newReservations = selections.map(s => ({
            room: s.room,
            date: s.date,
            slotTime: s.slotTime,
            slotIndex: s.slotIdx,
            user: req.session.currentUser._id,
            userRole: req.session.currentUser.role,
            isAnonymous: isAnon,
            checkedIn: false
        }));

        await Reservation.insertMany(newReservations);
        res.status(200).send("Success");
    } catch (err) {
        res.status(500).send("Error");
    }
};

// Cancel a reservation by ID
exports.cancel = async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.body.resId);
        res.redirect('/profile');
    } catch (err) {
        res.status(500).send("Error cancelling reservation.");
    }
};
