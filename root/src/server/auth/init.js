'use strict';

import passport from 'passport';
// var User = require('mongoose').model('User');
import userDB from '../../common/models/user_model';
import localStrategy from './strategies/local';
import path from 'path';

export default function() {

  // Serialize sessions
  passport.serializeUser(function(user, done) {

    done(null, user.id);

  });

  // Deserialize sessions
  passport.deserializeUser(function(id, done) {

    userDB.findOne({

      _id: id

    }, '-_salt -password', function(err, user) {

      done(err, user);

    });

  });

  // Initialize strategies
  localStrategy();

};
