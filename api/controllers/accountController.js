/* eslint-disable consistent-return */
const moment = require('moment');
const mongoose = require('mongoose');

const Account = mongoose.model('account');

exports.list_all_accounts = (req, res, next) => {
  Account.find({}, (err, accounts) => {
    if (err) {
      return next({
        message: 'An error has occurred while listing all accounts',
        error: err,
      });
    }
    res.json(accounts);
  });
};

exports.create_an_account = (req, res, next) => {
  const newAccount = new Account(req.body);
  newAccount.save((err, account) => {
    if (err) {
      return next({
        message: 'An error has occurred while creating an account',
        error: err,
      });
    }
    res.json(account);
  });
};

exports.read_an_account = (req, res, next) => {
  Account.findById(req.params.accountId, (err, account) => {
    if (err) {
      return next({
        message: 'An error has occurred while fetching an account',
        error: err,
      });
    } else if (!account) {
      return next({
        errorCode: 404,
        message: 'The account couldn\'t be found',
      });
    }
    const formattedAccount = {
      // eslint-disable-next-line no-underscore-dangle
      id: account._id,
      name: account.name,
    };
    if (account.transactions) {
      formattedAccount.amount = 0;
      formattedAccount.transactions = [];
      account.transactions.forEach((transaction) => {
        formattedAccount.amount += transaction.amount;
      });
      // Filter transactions
      const dateLimit = moment().utc().subtract(6, 'months');
      formattedAccount.transactions = account.transactions
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
    res.json(formattedAccount);
  });
};

exports.update_an_account = (req, res, next) => {
  Account.findOneAndUpdate({
    _id: req.params.accountId,
  },
  req.body,
  { new: true },
  (err, account) => {
    if (err) {
      return next({
        message: 'An error has occurred while updating an account',
        error: err,
      });
    }
    res.json(account);
  });
};

exports.delete_an_account = (req, res, next) => {
  Account.remove({
    _id: req.params.accountId,
  }, (err) => {
    if (err) {
      return next({
        message: 'An error has occurred while deleting an account',
        error: err,
      });
    }
    res.json({ message: 'Account successfully deleted' });
  });
};
