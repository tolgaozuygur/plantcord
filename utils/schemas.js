const mongoose = require('mongoose');

const User = new mongoose.Schema({
    id: { type: String, unique: true, required: true },
    wallet: { type: Number, default: 0 },
});

module.exports = mongoose.model('User', User);