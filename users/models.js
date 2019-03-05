'use strict';

const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const UserSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  }
  // firstName: {type: String, default: ''},
  // lastName: {type: String, default: ''}
});

UserSchema.methods.serialize = function() {
  return {
    username: this.username || ''
    // firstName: this.firstName || '',
    // lastName: this.lastName || ''
  };
};

const MessageSchema = mongoose.Schema({
  username: {
    type: String,
  },
  messageBody: {
    type: String,
    required: true
  },
  recipient: {
    type: String,
    required: true
  }
});

MessageSchema.methods.serialize = function() {
  return {
    username: this.username,
    message: this.messageBody
  };
};

UserSchema.methods.validatePassword = function(password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.statics.hashPassword = function(password) {
  return bcrypt.hash(password, 10);
};

const User = mongoose.model('User', UserSchema);
const Message = mongoose.model('Message', MessageSchema);

module.exports = {User, Message};