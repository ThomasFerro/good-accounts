const user = require('../controllers/userController');

module.exports = (app) => {
  // user routes
  app.route('/users')
    .get(user.login_required, user.get_all_users);

  app.route('/users')
    .post(user.register_user);

  app.route('/session')
    .post(user.sign_in);
};
