const user = require('../controllers/userController');

module.exports = (app) => {
  // user routes
  app.route('/users')
    .get(user.get_all_users);
};
