const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  amount: Number,
});

const AccountSchema = new Schema({
  Created_date: {
    type: Date,
    default: Date.now,
  },
  transactions: [TransactionSchema],
});

module.exports = mongoose.model('account', AccountSchema);
