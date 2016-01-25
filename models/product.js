var mongoose = require('mongoose');
var validate = require('mongoose-validator');
var Schema = mongoose.Schema;
var stripe = require('stripe');

// Product validators
var nameValidator = [
  validate({
    validator: 'isLength',
    arguments: [5, 50],
    message: 'Name must be at least {ARGS[0]} and less than {ARGS[1]} characters'
  })
];
var descriptionValidator = [
  validate({
    validator: 'isLength',
    arguments: [5, 300],
    message: 'Name must be at least {ARGS[0]} and less than {ARGS[1]} characters'
  })
];
var urlValidator = [
  validate({
    vallidator: 'isURL',
	arguments: [{ protocols: ['https'] }],

  })
];

var productSchema = new Schema({
  name: { type: String, validate: nameValidator },
  description: { type: String, validate: descriptionValidator },
  downloadURL: { type: String, validate: urlValidator },
  price: { type: Number, min: 50, max: 10000 },
  created_at: Date,
  updated_at: Date
});

productSchema.methods.purchase = function() {
  // Make stripe purchase here based on price of Product
};
