'use strict';

// Bootstrap settings
var settings = require('./config/init');

// Bootstrap loggers
var coreLogger = require('./config/loggers/init')('core');

// Let's be warned by whatever uncaught exception 
process.on('uncaughtException', function(err) {

  coreLogger.fatal(err, 'FATAL ERROR (uncaughtException)');

});

coreLogger.debug('Using settings: %s', settings.get('env'));

// Bootstrap db connection
var db = require('mongoose').connect(settings.get('db'), function(err) {

  if (err) {

    coreLogger.error('Could not connect to MongoDB', err);
  }

  coreLogger.debug('Connection to database established: %s ', settings.get(
    'db'));
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {

  require('mongoose').connection.close(function() {

    coreLogger.debug(
      'Mongoose default connection "%s" disconnected after server termination',
      settings.get('db'));

    process.exit(0);

  });

});

// Bootstrap the server application
var server = require('./config/server/init')(db);

// Start the app by listening on <port>
server.listen(settings.get('port'));

// Logging initialization
coreLogger.debug('Application started on port ' + settings.get('port'));

// Expose server to the world
exports = module.exports = server;