'use strict';

/**
 * Module dependencies.
 */
var coreLogger = require('../../loggers/init')('core'),
  Routes = require('../../../server/lib/routes');

module.exports = function(io) {

  io.use(function(socket, next) {

    var handshakeData = socket.request;

    handshakeData.isSocket = true;
    // make sure the handshake data looks good as before
    // if error do this:
    // next(new Error('not authorized');
    // else just call next
    next();

  });

  io.on('connection', function(socket) {

    coreLogger.debug('new user connected!');

    // load routing files if existing
    Routes.initIO(socket);

  });

};