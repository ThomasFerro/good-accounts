const mongoose = require('mongoose');
const UserSchema = require('./userModel');

const Schema = mongoose.Schema;

module.exports = new Schema({
  user: UserSchema,
  name: String,
  description: String,
  amount: Number,
  date: Date,
});
