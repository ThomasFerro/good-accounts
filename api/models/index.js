const mongoose = require('mongoose');
const AccountSchema = require('./accountModel');
const TransactionSchema = require('./transactionModel');
const UserSchema = require('./userModel');

module.exports = mongoose.model('account', AccountSchema);
module.exports = mongoose.model('transaction', TransactionSchema);
module.exports = mongoose.model('user', UserSchema);
