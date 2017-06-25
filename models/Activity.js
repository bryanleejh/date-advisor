const mongoose = require('mongoose');
const user = require('./User');

// schema defines what kind of data is to be expected
const activitySchema = new mongoose.Schema({
  id: String,
  name: String,
  address: String,
  lat: Number,
  lng: Number,
  category: String
  // user: user.schema,
}, { timestamps: true });

// model is how document creation and retrieval is handled
const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity;
