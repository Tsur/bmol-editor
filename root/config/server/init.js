'use strict';

/**
 * Module dependencies.
 */
var express = require('express'),
  settings = require('config'),
  path = require('path'),
  coreLogger = require('../loggers/init')('core'),
  utils = require('../../server/lib/utils');

module.exports = function(db) {

  var http, io, server;

  http = require('./http/init')(db);

  coreLogger.debug('Express application configured');

  server = require('http').Server(http);

  io = require('socket.io')(server);

  require('./socket/init')(io);

  coreLogger.debug('IO Server configured');

  // load models modules if existing
  utils.getFiles('./server/models/**/*_model.js').forEach(function(modelPath) {

    coreLogger.debug('Loading model %s', modelPath);

    require(path.resolve(modelPath));

  });

  // load routing files if existing
  utils.getFiles('./server/routes/**/*_route.js').forEach(function(routePath) {

    coreLogger.debug('Loading route %s', routePath);

    require(path.resolve(routePath))(http, io);

  });

  // Load main route in last term
  http.get('/*', function(req, res) {

    res.render('index', {
      user: req.user || null
    }, function(err, html) {

      if (err) {

        err.info = 'Could not server index page';
        return next(err);
      }

      coreLogger.debug('Serving index');
      res.send(html);

    });

  });

  // 500 error middleware
  http.use(function(err, req, res, next) {

    if (err) {

      // Send it to the logger. A 500 error should never comes up!
      coreLogger.error('FATAL ERROR: we are rendering a 500 page error', err);

      if (err.json === true) {

        return res.status(500).json(err);
      }

      res.render('500', {
        error: err.stack
      });
    }

  });

  // Enable auth
  // require('./auth/init')();

  return http;

};