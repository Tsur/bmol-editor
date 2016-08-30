'use strict';

/**
 * Module dependencies.
 */
var userDB = require('mongoose').model('User'),
  passport = require('passport'),
  roles = require('kalzate/public/src/utils/roles').userRoles,
  coreLogger = require('./../../../../config/loggers/init')('core'),
  settings = require('config');

exports.editUser = function(req, res, next) {

  var data = {};

  if (req.body.password) {

    data = userDB.generatePassword(req.body.password);
  }

  if (req.body.username) {

    data.username = req.body.username;
  }

  coreLogger.debug('Editing user', req.user, req.body.password, data);

  userDB.findOneAndUpdate({
    '_id': req.user['_id']
  }, data, function(err, user) {

    if (err || !user) {

      coreLogger.error('User could not be edited', err || user);
      return res.status(404).end();
    }

    coreLogger.debug('User edited', user);

    res.status(200).end();
  });
};