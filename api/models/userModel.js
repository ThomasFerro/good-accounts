const mongoose = require('mongoose');

const Schema = mongoose.Schema;

module.exports = new Schema({
  nickname: String,
  firstName: String,
  lastName: String,
  email: String,
  picture: String,
  color: String,
});
