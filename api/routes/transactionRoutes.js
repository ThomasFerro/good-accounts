const transaction = require('../controllers/transactionController');

module.exports = (app) => {
  // transaction Routes
  app.route('/accounts/:accountId/transactions')
    .post(transaction.create_a_transaction);
};
