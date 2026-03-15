// controllers/reservationCon.js
const Reservation = require('../models/reservation');

// Handle creating a single reservation
exports.reserve = async (req, res) => {
    try {
        const { room, date, slotIndex, slotTime, isAnonymous } = req.body;
        await Reservation.create({
            room, date, slotIndex, slotTime,
            isAnonymous: isAnonymous === 'true' || isAnonymous === true,
            user:     req.session.currentUser._id,
            userRole: req.session.currentUser.role
        });
        res.redirect(`/rooms?lab=${encodeURIComponent(room)}&date=${date}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating reservation.");
    }
};

// Handle bulk reservation (for the selected slots)
exports.reserveMultiple = async (req, res) => {
    try {
        const { selections, isAnon } = req.body;
        
        if (!Array.isArray(selections) || selections.length === 0) {
            return res.status(400).send("No slots selected.");
        }

        // Map the selections to database schema
        const newReservations = selections.map(s => ({
            room:        s.room,
            date:        s.date,           // YYYY-MM-DD from client
            slotTime:    s.slotTime,
            slotIndex:   s.slotIndex,      // was s.slotIdx — field name now matches client
            user:        req.session.currentUser._id,
            userRole:    req.session.currentUser.role,
            isAnonymous: isAnon === true || isAnon === 'true',
            checkedIn:   false
        }));

        await Reservation.insertMany(newReservations);
        res.status(200).send("Success");
    } catch (err) {
        console.error(err);
        res.status(500).send("Error");
    }
};

// Cancel own reservation (student/faculty)
exports.cancel = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.body.resId);
        if (!reservation) return res.status(404).send("Reservation not found.");

        const userId     = req.session.currentUser._id.toString();
        const userRole   = req.session.currentUser.role;
        const isOwner    = reservation.user.toString() === userId;
        const isTech     = userRole === 'technician';

        if (!isOwner && !isTech) {
            return res.status(403).send("Not authorised to cancel this reservation.");
        }

        await Reservation.findByIdAndDelete(req.body.resId);
        res.redirect('/profile');
    } catch (err) {
        console.error(err);
        res.status(500).send("Error cancelling reservation.");
    }
};

// For Technician: mark a student as checked-in
exports.checkIn = async (req, res) => {
    try {
        if (req.session.currentUser?.role !== 'technician') {
            return res.status(403).send("Technicians only.");
        }
        await Reservation.findByIdAndUpdate(req.body.resId, { checkedIn: true });
        res.redirect(`/rooms?lab=${encodeURIComponent(req.body.room)}&date=${req.body.date}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error checking in.");
    }
};

// for Technician: cancel a no-show (same as cancel but technician-only route)
exports.cancelNoShow = async (req, res) => {
    try {
        if (req.session.currentUser?.role !== 'technician') {
            return res.status(403).send("Technicians only.");
        }
        await Reservation.findByIdAndDelete(req.body.resId);
        res.redirect(`/rooms?lab=${encodeURIComponent(req.body.room)}&date=${req.body.date}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error cancelling no-show.");
    }
};

// For Technician: manually reserve a slot for a walk-in student
exports.techReserve = async (req, res) => {
    try {
        if (req.session.currentUser?.role !== 'technician') {
            return res.status(403).send("Technicians only.");
        }
        const { room, date, slotIndex, slotTime, walkinName } = req.body;
        await Reservation.create({
            room, date,
            slotIndex: parseInt(slotIndex),
            slotTime,
            user:        req.session.currentUser._id,
            userRole:    'technician',
            isAnonymous: false,
            checkedIn:   true,    // walk-ins are immediately checked in
            walkinName:  walkinName || "Walk-in"
        });
        res.redirect(`/rooms?lab=${encodeURIComponent(room)}&date=${date}`);
    } catch (err) {
        console.error(err);
        res.status(500).send("Error creating walk-in reservation.");
    }
};
