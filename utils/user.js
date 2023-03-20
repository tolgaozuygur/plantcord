const {model, Schema} = require('mongoose');

const User = new Schema({
    id: { type: String, unique: true, required: true },
    waterCount: { type: Number, default: 0 },
    windCount: { type: Number, default: 0 }
});

module.exports = model('User', User);