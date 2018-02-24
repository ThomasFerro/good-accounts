/* eslint-disable no-param-reassign */
const moment = require('moment');
const mongoose = require('mongoose');

const Account = mongoose.model('account');

exports.list_all_accounts = (req, res) => {
  Account.find({}, (err, accounts) => {
    if (err) {
      res.send(err);
    }
    res.json(accounts);
  });
};

exports.create_an_account = (req, res) => {
  const newAccount = new Account(req.body);
  newAccount.save((err, account) => {
    if (err) {
      res.send(err);
    }
    res.json(account);
  });
};

exports.read_an_account = (req, res) => {
  Account.findById(req.params.accountId, (err, account) => {
    if (err) {
      res.send(err);
    }
    if (account.transactions) {
      account.amount = 0;
      account.transactions.forEach((transaction) => {
        account.amount += transaction.amount;
      });
      // Filter transactions
      const dateLimit = moment().utc().subtract(6, 'months');
      account.transactions = account.transactions
        .filter(transaction =>
          transaction
          && transaction.date
          && moment(transaction.date).isAfter(dateLimit))
        .sort((transactionA, transactionB) => {
          if (moment(transactionA.date).isAfter(moment(transactionB.date))) {
            return -1;
          }
          return 1;
        });
    }

    res.json(account);
  });
};

exports.update_an_account = (req, res) => {
  Account.findOneAndUpdate({
    _id: req.params.accountId,
  },
  req.body,
  { new: true },
  (err, account) => {
    if (err) {
      res.send(err);
    }
    res.json(account);
  });
};

exports.delete_an_account = (req, res) => {
  Account.remove({
    _id: req.params.accountId,
  }, (err) => {
    if (err) {
      res.send(err);
    }
    res.json({ message: 'Account successfully deleted' });
  });
};
