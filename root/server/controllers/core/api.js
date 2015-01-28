'use strict';

/**
 * Module dependencies.
 */
var entities = require('../../data/entities');

// exports.federation = function(req, res, next) {

// };

exports.entities = function(data, fn) {

  return fn(null, entities);

};