/* eslint-disable consistent-return */
const mongoose = require('mongoose');

const Account = mongoose.model('account');
const Transaction = mongoose.model('transaction');

exports.create_a_transaction = (req, res, next) => {
  Account.findById(req.params.accountId, (err, account) => {
    if (err) {
      return next({
        message: 'An error has occurred while fetching an account to add transaction',
        error: err,
      });
    }
    const newTransaction = new Transaction(req.body);

    account.transactions.push(newTransaction);
    return account.save((saveErr, updatedAccount) => {
      if (saveErr) {
        return next({
          message: 'An error has occurred while adding transaction to an account',
          error: saveErr,
        });
      }
      res.json(updatedAccount);
    });
  });
};
