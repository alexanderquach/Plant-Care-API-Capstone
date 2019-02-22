'use strict';

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const plantSchema = mongoose.Schema({
  icon: {type: String, required: true},
  name: {type: String, required: true},
  wateringRequirements: {type: String, required: true},
  sunlightRequirements: {type: String, required: true},
  notes: {type: String, required: false},
  username: {type: String}
});

plantSchema.methods.serialize = function() {
  return {
    icon: this.icon,
    name: this.name,
    wateringRequirements: this.wateringRequirements,
    sunlightRequirements: this.sunlightRequirements,
    notes: this.notes
  };
};

const Plant = mongoose.model('Plant', plantSchema);

module.exports = {Plant};