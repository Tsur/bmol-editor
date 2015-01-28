'use strict';

// Bootstrap settings
var config = require('config');
var bunyan = require('bunyan');
var _loggers = {};

// Load logger by its name
exports = module.exports = function(logName, namespace) {

  namespace = namespace || 'common';

  // if not cached, look for it and cache it
  if (!_loggers[logName]) {

    var logConfig = require('./' + namespace + '/' + config.get('loggers'))[logName];
    var log = bunyan.createLogger(logConfig);

    log.on('error', function(err, stream) {

      throw new Error('FATAL ERROR: logger not working (' + logName + ') ' + err);

    });

    _loggers[logName] = log;
  }

  return _loggers[logName];
};