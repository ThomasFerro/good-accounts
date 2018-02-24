const accountRoutes = require('./accountRoutes');
const transactionRoutes = require('./transactionRoutes');
const userRoutes = require('./userRoutes');

module.exports = (app) => {
  accountRoutes(app);
  transactionRoutes(app);
  userRoutes(app);
};
