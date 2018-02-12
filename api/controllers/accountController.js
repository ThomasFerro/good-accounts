const mongoose = require('mongoose');

const Account = mongoose.model('account');

exports.list_all_accounts = (req, res) => {
  Account.find({}, (err, account) => {
    if (err) {
      res.send(err);
    }
    res.json(account);
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
