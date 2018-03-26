/* eslint-disable consistent-return */
const jsonwebtoken = require('jsonwebtoken');
const escape = require('escape-regexp');
const bcrypt = require('bcrypt');
const mongoose = require('mongoose');

const User = mongoose.model('user');

const getUserDisplayName = (user) => {
  if (user && user.nickname) {
    return `${user.nickname} (${user.firstName} ${user.lastName})`;
  }

  return `${user.firstName} ${user.lastName}`;
};

const mapUser = user => ({
  // eslint-disable-next-line no-underscore-dangle
  id: user._id,
  displayName: getUserDisplayName(user),
  nickname: user.nickname,
  firstName: user.firstName,
  lastName: user.lastName,
  email: user.email,
  picture: user.picture,
  color: user.color,
});

exports.get_all_users = (req, res, next) => {
  let query = {};
  if (req.query && req.query.searchQuery) {
    // Building the search query
    query = {
      $or: [
        {
          nickname: {
            $regex: escape(req.query.searchQuery),
            $options: 'i',
          },
        }, {
          firstName: {
            $regex: escape(req.query.searchQuery),
            $options: 'i',
          },
        }, {
          lastName: {
            $regex: escape(req.query.searchQuery),
            $options: 'i',
          },
        },
      ],
    };
  }
  User.find(query, (err, users) => {
    if (err) {
      return next({
        message: 'An error has occurred while searching for users',
        error: err,
      });
    }

    let formattedUsers = [];
    if (users && users.length) {
      formattedUsers = users.map(mapUser);
    }

    res.json(formattedUsers);
  });
};

exports.register_user = (req, res, next) => {
  const newUser = new User(req.body);
  bcrypt.hash(req.body.password, 12, (hashError, hash) => {
    if (hashError) {
      return next({
        message: 'An error has occurred while creating the users',
        error: hashError,
      });
    }

    newUser.hashPassword = hash;
    newUser.save((err, user) => {
      if (err) {
        return next({
          message: 'An error has occurred while creating the users',
          error: err,
        });
      }
      res.json(mapUser(user));
    });
  });
};

exports.sign_in = (req, res, next) => {
  User.findOne({
    email: req.body.email,
  }, (err, user) => {
    if (err) {
      return next({
        message: 'An error has occurred while finding the user',
        error: err,
      });
    }
    if (!user) {
      return next({
        message: 'User not found',
        errorCode: 404,
      });
    }
    // Password compare
    user.comparePassword(req.body.password)
      .then(() => {
        // JWT
        res.json({
          message: 'Authentication successful',
          // TODO : Change key
          token: jsonwebtoken.sign(mapUser(user), 'RESTAPIKEY'),
        });
      })
      .catch((compareErr) => {
        next({
          message: 'Authentication unsuccessful',
          err: compareErr,
        });
      });
  });
};

exports.login_required = (req, res, next) => {
  if (req.user) {
    next();
  } else {
    next({
      message: 'No authorized user provided',
      errorCode: 401,
    });
  }
};
