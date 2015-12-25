'use strict';
/**
 * @module Routes
 * @version 1.0
 * @author Zurisadai Pabon < zurisadai.pabon@gmail.com >
 * @description This module provides several utilities for managing http & socket routes
 *
 * @example Example setting an HTTP route
 * var Routes = require('./routes');
 * Routes.http(app)('get', 'my/url', function(data){}));
 *
 * @example Example setting an IO route
 * var Routes = require('./routes');
 * Routes.io('my:url', function(data){});
 *
 */

/**
 * Module dependencies.
 */
var _ = require('lodash');
var Common = require('./common');
var _APP;
var _Route;
var _ioHandlers = {};

_Route = function(app) {

  _APP = app;

  return _Route;

};

_Route.create = function(url, handler) {

  url = Common.prependTo(url, '/');

  _Route.http('post', url, handler);

  _Route.io(Array.prototype.splice.call(url, 1).join('').replace(/\//gi, ':'),
    handler);

};

_Route.http = function() {

  var method, url, handler;

  if (arguments.length == 2) {

    method = 'get';
    url = arguments[0];
    handler = arguments[1];

  } else {

    method = arguments[0];
    url = arguments[1];
    handler = arguments[2];

  }

  _APP.route(url)[method.toLowerCase()](function(req, res, next) {

    var data = req.body;

    handler(req, data, function(err, result) {

      if (err) {

        return next();

      }

      res.status(200).json(result);

    });

  });

};

_Route.io = function(command, handler) {

  _ioHandlers[command] = handler;

};

_Route.initIO = function(socket) {

  _.forEach(_ioHandlers, function(handler, command) {

    socket.on(command, function(data) {

      handler(socket.handshake, data, function(err, result) {

        if (err) {

          return socket.emit(command + ':error:' + data._id, err);

        }

        socket.emit(command + ':end:' + data._id, result);

      });

    });

  });

};

module.exports = exports = _Route;