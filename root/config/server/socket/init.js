'use strict';

/**
 * Module dependencies.
 */
var coreLogger = require('../../loggers/init')('core'),
    Routes = require('../../../server/lib/routes');

module.exports = function(io) {

    io.on('connection', function(socket) {

        coreLogger.debug('new user connected!');

        // load routing files if existing
        Routes.initIO(socket);

    });

};