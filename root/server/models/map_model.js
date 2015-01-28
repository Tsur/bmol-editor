'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * User Schema
 */
var balanceSchema = new Schema({

  'address': {
    type: String,
    required: true
  },

  'balances': {

    type: Array,
    required: true
  },

  'date': {

    type: Date,
    index: true,
    required: true
  },

  'created': {

    type: Date,
    default: new Date()
  }
});

/**
 * Find rates by date
 * @param {object} momentjs date object
 */
balanceSchema.statics.findBalance = function(date, address, callback) {

  if (!mongoose.connection.readyState) {
    return callback('Connect to a mongodb database!');
  }

  var query = {
    'date': {
      '$gte': date.toDate(),
      '$lt': date.clone().add(1, 'minutes').toDate()
    },
    'address': address
  };

  this.findOne(query, {
    address: 1,
    balances: 1,
    date: 1
  }, callback);
};

module.exports = exports = mongoose.model('Balance', balanceSchema);