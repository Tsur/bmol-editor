'use strict';

/**
 * Module dependencies.
 */
var fs = require('fs');
var entities = require('../../data/entities');

// exports.federation = function(req, res, next) {

// };

exports.entities = function(req, data, fn) {

  return fn(null, {
    entities: entities
  });

};

exports.palette = function(req, data, fn) {

  var path = __dirname + '/../../../tools/sprites/bmol.spr';

  fs.readFile(path, function(err, buf) {

    if (err) {

      return fn(err, null);

    }

    fn(null, {
      palette: buf,
      bytes: buf.length
    });

  });

  // Much faster using a stream
  // return fn(null, fs.createReadStream(path));

};