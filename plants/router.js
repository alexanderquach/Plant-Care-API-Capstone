'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const {Plant} = require('./models');
const {User} = require('../users/models');
const router = express.Router();
const jsonParser = bodyParser.json();
const passport = require('passport');
const jwtAuth = passport.authenticate('jwt', {session: false});

router.get('/allPlants', jwtAuth, (req, res) => {
  // console.log(req.user.username);
  User.findOne({username: req.user.username})
  .then(user => {
    return Plant.find({username: req.user.username})
      .then(plants => {
        res.json(plants)
      });
  })
  .catch(err => {
    res.status(500).json({
      message: 'Internal server error'
    });
  });
});

router.get('/:id', jwtAuth, (req, res) => {
  console.log(req.params.id);
  Plant.findById(req.params.id)
  .then(plant => {
    return res.json(plant)
  })
  .catch(err => {
    res.status(500).json({
      message: 'Internal server error'
    });
  });
});

router.get('/searchedUserPlants', (req, res) => {
  console.log(req, 'Random');
  Plant.find({username: req.user.username})
  .then(plants => {
    res.json(plants)
  })
  .catch(err => {
    console.log(err)
    res.status(500).json({
      message: 'Internal server error'
    });
  });
});

router.post('/new', jsonParser, jwtAuth, (req, res) => {
  // console.log(req.user);
  const requiredFields = ['icon', 'name', 'wateringRequirements', 'sunlightRequirements'];
  const missingField = requiredFields.find(field => !(field in req.body));

  if (missingField) {
    return res.status(422).json({
      code: 422,
      reason: 'Validation error',
      message: 'Missing field',
      location: missingField
    });
  }

  const stringFields = ['icon', 'name', 'wateringRequirements', 'sunlightRequirements'];
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

  let {icon, name, wateringRequirements, sunlightRequirements, username} = req.body;

  name = name.trim();

  return Plant.find({username, name})
    .count()
    .then(count => {
      if (username === req.body.username && count > 0) {
        return Promise.reject({
          code: 422,
          reason: 'Validation error',
          message: 'Plant with that name already exists',
          location: 'name'
        });
      }
      console.log(req.user);
      return Plant.create({
        icon: req.body.icon,
        name: req.body.name,
        wateringRequirements: req.body.wateringRequirements,
        sunlightRequirements: req.body.sunlightRequirements,
        notes: req.body.notes,
        username: req.user.username
      });
    })
    .then (plant => {
      // console.log(plant);
      return res.status(201).json(plant);
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

router.put('/:id', jsonParser, jwtAuth, (req, res) => {
  // console.log(req.params.id, req.body.id);
  // if (!(req.params.id && req.body.id && req.params.id === req.body.id)) {
  //   res.status(400).json({
  //     error: 'Request path id and request body id values must match'
  //   });
  // }
  
  const updated = {};
  const updateableFields = ['icon', 'name', 'wateringRequirements', 'sunlightRequirements', 'notes'];
  updateableFields.forEach(field => {
    if(field in req.body) {
      updated[field] = req.body[field];
    }
  });

  Plant
  .findByIdAndUpdate(req.params.id, {$set: updated}, {new: true})
  .then(updatedPlant => {
    res.status(200).json({
      icon: `${updatedPlant.icon}`,
      name: `${updatedPlant.name}`,
      wateringRequirements: `${updatedPlant.wateringRequirements}`,
      sunlightRequirements: `${updatedPlant.sunlightRequirements}`,
      notes: `${updatedPlant.notes}`,
    });
  })
  .catch(err => {
    res.status(500).json({
      message: 'Internal server error'
    })
  })
});

router.delete('/:id', jwtAuth, (req, res) => {
  Plant
  .findByIdAndRemove(req.params.id)
  .then(() => {
    console.log(`Deleted plant with id \`$req.params.id}\``);
    res.status(204).json({
      message: 'Successfully deleted'
    })
  })
});

module.exports = {router};