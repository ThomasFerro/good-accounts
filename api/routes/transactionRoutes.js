const transaction = require('../controllers/transactionController');
const user = require('../controllers/userController');

module.exports = (app) => {
  // transaction Routes
  app.route('/accounts/:accountId/transactions')
    .post(user.login_required, transaction.create_a_transaction);
};
