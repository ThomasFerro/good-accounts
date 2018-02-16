const mongoose = require('mongoose');
const AccountSchema = require('./accountModel');
const TransactionSchema = require('./transactionModel');

module.exports = mongoose.model('account', AccountSchema);
module.exports = mongoose.model('transaction', TransactionSchema);
