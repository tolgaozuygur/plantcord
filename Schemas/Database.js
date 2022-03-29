const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  Plant: String,
  Day: Number,
  NextDay: Number,
  Hour: Number,
  Water: { type: Object, default: {} },
  Moisture: { type: Object, default: {} },
});

const model = mongoose.model('Plant', schema);

module.exports = model;
