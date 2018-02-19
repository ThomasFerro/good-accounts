const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = new Schema({
  name: String,
  description: String,
  amount: Number,
});
