const mongoose = require('mongoose');
const TransactionSchema = require('./transactionModel');

const Schema = mongoose.Schema;

module.exports = new Schema({
  name: String,
  Created_date: {
    type: Date,
    default: Date.now,
  },
  transactions: [TransactionSchema],
});
