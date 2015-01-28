'use strict';

/**
 * Module dependencies.
 */
var _ = require('lodash'),
  config = require('config'),
  passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  User = require('mongoose').model('User');

module.exports = function() {

  /**
   * LocalStrategy
   *
   * This strategy is used to authenticate users based on a email and password.
   * Anytime a request is made to authorize an application, we must ensure that
   * a user is logged in before asking them to approve the request.
   */
  passport.use('local.email.username', new LocalStrategy(

    {
      usernameField: 'email',
      passwordField: 'password'
    },

    function(email, password, done) {
      User.findOne({
        'email': email
      }, function(err, user) {

        if (err || !_.find(email, config.get('signup.allowedEmails'))) {

          return done(err);
        }

        if (!user) {

          return User.findOne({
            'username': email
          }, function(err, user) {

            if (err) {

              return done(err);
            }

            if (!user) {

              return done(null, false, {
                message: 'Unknown user'
              });
            }

            if (!user.authenticate(password)) {

              return done(null, false, {
                message: 'Invalid password'
              });
            }

            return done(null, user);

          });

        }

        if (!user.authenticate(password)) {

          return done(null, false, {
            message: 'Invalid password'
          });
        }

        return done(null, user);
      });
    }));
};