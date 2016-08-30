'use strict';

/**
 * Module dependencies.
 */
var userDB = require('mongoose').model('User'),
  coreLogger = require('./../../../../config/loggers/init')('core'),
  user_utils = require('./../../../lib/user_utils'),
  settings = require('config');

var steps = {

  'request_code': function(req, res, next) {

    var code = user_utils.generateRandomCode('1nnnnnnnnnnnnnnn');
    var expires = new Date();

    expires.setTime(expires.getTime() + (settings.get(
      'user.recover.codeExpiringTime') * 60 * 1000));

    userDB.findOneAndUpdate({
      $or: [{
        email: req.body.data
      }, {
        username: req.body.data
      }]
    }, {
      $set: {
        _forgot_code: code,
        _forgot_code_expire: expires
      }
    }, function(err, user) {

      if (err || !user) {

        coreLogger.error(
          'Error at "request_code" method. User could not change the password',
          err);
        return res.status(400).end();
      }

      res.status(200).end();

      user.sendMail(settings.get('user.recover.mailCode'), {
        code: code
      }, function(err, response) {

        if (err) {

          return coreLogger.error(
            'Error at "request_code" method. Email could not be sent to user "%s" could not change the password',
            user._id, err);
        }

        coreLogger.debug(
          'forgot password: request_code email has been sent to user "%s"',
          user.email, user);
      });
    });
  },

  'send_password': function(req, res, next) {

    var plain_password = user_utils.generateRandomCode();
    var set = userDB.generateHashPassword(plain_password);

    userDB.findOneAndUpdate({
      $or: [{
        email: req.body.data
      }, {
        username: req.body.data
      }]
    }, set, function(err, user) {

      if (err || !user || user._forgot_code != req.body.code || (new Date()) >
        user._forgot_code_expire) {

        coreLogger.error(
          'Error at "send_password" method. User could not change the password',
          err);
        return res.status(400).end();
      }

      coreLogger.debug('Save to database', set, plain_password);

      res.status(200).end();

      user.sendMail(settings.get('user.recover.mailPassword'), {
        password: plain_password
      }, function(err, response) {

        if (err) {

          return coreLogger.error(
            'Error at "send_password" method. Email could not be sent to user "%s" could not change the password',
            user._id, err);
        }

        coreLogger.debug(
          'forgot password: send_password email has been sent to user "%s"',
          user.email, user);
      });
    });
  }
}

exports.forgot = function(req, res, next) {

  var step = req.body.step || 'request_code';

  if (!steps[step]) {

    return res.status(400).end();
  }

  steps[step](req, res, next);
};