'use strict';

var passport = require('passport'),
  var coreLogger = require('./../loggers/init')('core'),
    var User = require('mongoose').model('User'),
      var path = require('path'),
        var utils = require('./../../server/lib/system_utils');

module.exports = function() {

  // Serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  // Deserialize sessions
  passport.deserializeUser(function(id, done) {
    User.findOne({
      _id: id
    }, '-_salt -password', function(err, user) {
      done(err, user);
    });
  });

  // Initialize strategies
  utils.getFiles('./config/server/auth/**/st_local*.js').forEach(function(authStrategy) {

    coreLogger.debug('Loading auth strategy %s', authStrategy);

    require(path.resolve(authStrategy))();
  });
};