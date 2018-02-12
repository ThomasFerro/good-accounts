const account = require('../controllers/accountController');

module.exports = (app) => {
  // account Routes
  app.route('/accounts')
    .get(account.list_all_accounts)
    .post(account.create_an_account);


  app.route('/accounts/:accountId')
    .get(account.read_an_account)
    .put(account.update_an_account)
    .delete(account.delete_an_account);
};
