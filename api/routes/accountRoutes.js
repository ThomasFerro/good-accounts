const account = require('../controllers/accountController');
const user = require('../controllers/userController');

module.exports = (app) => {
  // account Routes
  app.route('/accounts')
    .get(user.login_required, account.list_all_accounts)
    .post(user.login_required, account.create_an_account);


  app.route('/accounts/:accountId')
    .get(user.login_required, account.read_an_account)
    .put(user.login_required, account.update_an_account)
    .delete(user.login_required, account.delete_an_account);
};
