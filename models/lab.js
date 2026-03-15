// models/lab.js
const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
    name:     { type: String, required: true, unique: true },
    building: { type: String, required: true },
    capacity: { type: Number, required: true },
    floor:    { type: String }
});

module.exports = mongoose.model('Lab', labSchema);
