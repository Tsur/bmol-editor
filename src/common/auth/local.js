'use strict';

/**
 * Module dependencies.
 */
import userDB from '../models/user_model';

export default function(email, password, done) {

  /**
   * LocalStrategy
   *
   * This strategy is used to authenticate users based on a email and password.
   * Anytime a request is made to authorize an application, we must ensure that
   * a user is logged in before asking them to approve the request.
   */

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

};
