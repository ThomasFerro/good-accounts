const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  nickname: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  picture: String,
  color: String,
  hashPassword: {
    type: String,
    required: true,
  },
});

// Has to be an unnamed function in order to user the "this"
// eslint-disable-next-line func-names
UserSchema.methods.comparePassword = function (password) {
  return new Promise((result, reject) => {
    if (!password
    || !this.hashPassword) {
      reject({
        message: 'No password',
      });
    } else {
      bcrypt.compare(password, this.hashPassword, (err, res) => {
        if (err || !res) {
          reject({
            message: 'Error while comparing password',
            error: err,
          });
        } else {
          result(res);
        }
      });
    }
  });
};

module.exports = UserSchema;
