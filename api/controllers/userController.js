const escape = require('escape-regexp');
const mongoose = require('mongoose');

const User = mongoose.model('user');

exports.get_all_users = (req, res) => {
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
      res.send(err);
    }

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

    let formattedUsers = [];
    if (users && users.length) {
      formattedUsers = users.map(mapUser);
    }

    res.json(formattedUsers);
  });
};
