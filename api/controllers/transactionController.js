const mongoose = require('mongoose');

const Account = mongoose.model('account');
const Transaction = mongoose.model('transaction');

exports.create_a_transaction = (req, res) => {
  Account.findById(req.params.accountId, (err, account) => {
    if (err) {
      res.send(err);
    }
    const newTransaction = new Transaction(req.body);
    account.transactions.push(newTransaction);
    account.save((saveErr, updatedAccount) => {
      if (saveErr) {
        res.send(saveErr);
      }
      res.json(updatedAccount);
    });
  });
};
