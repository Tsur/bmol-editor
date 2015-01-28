'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
  settings = require('config');

module.exports = function(db) {

  var app = express();

  // Load common default express settings
  require('./common')(app, db);

  // Load specific environ express settings
  require('./express_' + settings.get('env'))(app, db);

  return app;

};