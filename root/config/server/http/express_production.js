'use strict';

/**
 * Module dependencies.
 */
var helmet = require('helmet'),
  settings = require('config');

module.exports = function(app, db) {

  // Disable info
  app.disable('x-powered-by');

  // Use helmet to secure Express headers
  app.use(helmet.xframe());
  app.use(helmet.xssFilter());
  app.use(helmet.nosniff());
  app.use(helmet.ienoopen());

  // Maintenance middleware come into scene
  app.use(function(req, res, next) {

    if (settings.maintenance) {

      return res.render('maintenance');
    }

    next();

  });

};