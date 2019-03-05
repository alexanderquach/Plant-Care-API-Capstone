'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {User, Message} = require('./models');
const router = express.Router();
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', {session: false});

router.post('/signup', jsonParser, (req, res) => {
  const requiredFields = ['username', 'password'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation error',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['username', 'password'];
  const nonStringField = stringFields.find(
    field => field in req.body && typeof req.body[field] !== 'string'
  );
  
  if (nonStringField) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation error',
      message: 'Incorrect field type: expected string'
    });
  }

  const explicitlyTrimmedFields = ['username', 'password'];
  const nonTrimmedField = explicitlyTrimmedFields.find(
    field => req.body[field].trim() !== req.body[field]
  );

  if (nonTrimmedField) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation error',
      message: 'Cannot start or end with whitespace'
    });
  }

  const sizedFields = {
    username: {
      min: 1
    },
    password: {
      min: 10,
      max: 72
    }
  };
  const tooSmallField = Object.keys(sizedFields).find(
    field => 'min' in sizedFields[field] &&
      req.body[field].trim().length < sizedFields[field].min
  );
  const tooLargeField = Object.keys(sizedFields).find(
    field => 'max' in sizedFields[field] &&
      req.body[field].trim().length > sizedFields[field].max
  );

  if (tooSmallField || tooLargeField) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation error',
      message: tooSmallField
        ? `Must be at least ${sizedFields[tooSmallField].min} characters long`
        : `Must be at most ${sizedFields[tooLargeField].max} characters long`,
      location: tooSmallField || tooLargeField
    });
  }

  let {username, password} = req.body;

  // firstName = firstName.trim();
  // lastName = lastName.trim();

  return User.find({username})
    .count()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'Validation error',
          message: 'Username already taken',
          location: 'username'
        });
      }
      return User.hashPassword(password);
    })
    .then(hash => {
      return User.create({
        username,
        password: hash
      });
    })
    .then(user => {
      return res.status(201).json(user.serialize());
    })
    .catch(err => {
      if (err.reason === 'Validation error') {
        return res.status(err.code).json(err);
      }
      res.status(500).json({
        code: 500,
        message: 'Internal server error'
      });
    });
});

router.get('/', (req, res) => {
  return User.find()
    .then(users => {
      res.json(users.map(user => user.serialize()));
    })
    .catch(err => {
      res.status(500).json({
        message: 'Internal server error'
      });
    });
});

router.get('/:username', (req, res) => {
  return User.findOne({username: req.params.username})
    .then(user => {
      res.status(200).json(user.serialize())
    })
    .catch(err => {
      res.status(500).json({
        message: 'Unable to find user'
      });
    });
});

router.get('/messages/:username', jwtAuth, (req, res) => {
  return Message.find({recipient: req.user.username})
  .then(messages => {
    return res.status(200).json(messages.map(message => message.serialize()));
  })
  .catch(err => {
    res.status(500).json({
      message: 'Internal server error'
    });
  });
});

router.post('/messages', jsonParser, jwtAuth, (req, res) => {
  const requiredFields = ['messageBody', 'recipient'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation error',
      message: 'Missing field',
      location: missingField
    });
  }

  return Message.create({
    username: req.user.username,
    messageBody: req.body.messageBody,
    recipient: req.body.recipient
  })
  .then(message => {
    return res.status(201).json(message);
  })
  .catch(err => {
    res.status(500).json({
      code: 500,
      message: 'Internal server error'
    })
  })
});

module.exports = {router};