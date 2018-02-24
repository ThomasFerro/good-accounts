const mongoose = require('mongoose');
const TransactionSchema = require('./transactionModel');
const UserSchema = require('./userModel');

const Schema = mongoose.Schema;

module.exports = new Schema({
  name: {
    type: String,
    required: true,
  },
  created_date: {
    type: Date,
    default: Date.now,
  },
  creator: UserSchema,
  transactions: [TransactionSchema],
  users: [UserSchema],
});
