'use strict';

/**
 * Module dependencies.
 */
import passport from 'passport';
import LocalStrategy from 'passport-local';
import userDB from '../../../common/models/user_model';

export default function() {

  /**
   * LocalStrategy
   *
   * This strategy is used to authenticate users based on a email and password.
   * Anytime a request is made to authorize an application, we must ensure that
   * a user is logged in before asking them to approve the request.
   */
  passport.use(new LocalStrategy.Strategy(

    {
      usernameField: 'email', //change to identifier
      passwordField: 'password'
    },

    function(email, password, done) {

      userDB.findOne({
          $or: [{
            'email': email
          }, {
            'username': email
          }]
        },
        function(err, user) {

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

  ));

};
