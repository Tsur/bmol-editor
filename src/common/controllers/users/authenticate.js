'use strict';

/**
 * Module dependencies.
 */
 import mongoose from 'mongoose';
 import passport from 'passport';
 import userDB from '../../models/user_model';
 import {parseFullName, generateRandomCode} from '../../helpers/users';
 import settings from '../../../settings/init';

/**
 * Signin an user
 *
 * @param {Object} user
 * @param {Function} login
 * @param {Function} callback
 * @return {null}
 * @api public
 */
var _signin = function(user, middleware, callback) {

  var doc = {

    $set: {

      signin_date: new Date(),
      signin_ip: middleware.ip || '0.0.0.0',
      signin_ua: middleware.headers['user-agent'] || ''
    }
  };

  userDB.findOneAndUpdate({
    _id: user._id
  }, doc, function(err, updated_user) {

    if (err) {

      err.message = "Last login data could not be updated.";
      return callback(err);
    }

    // Parse & Remove sensitive data before login
    updated_user.password = undefined;
    updated_user._salt = undefined;
    updated_user._forgot_code = undefined;
    updated_user._forgot_code_expire = undefined;

    middleware.login(updated_user, function(err) {

      if (err) {

        return callback(err);
      }

      callback(null, updated_user);

      //callback(null, {username: user.username, role: user.role, email: user.email, firstname: user.firstname, lastname: user.lastname});
    });
  });
};

/**
 * authenticate and user by local passport strategy (email & password)
 * and then login the user
 */
export function signin(req, res, next) {

  passport.authenticate('local', function(err, authenticated_user, info) {

    if (err || !authenticated_user) {

      console.error('User could not be authenticated', err || info);

      res.status(400).send(info);
      // Simulate slow server response
      //setTimeout(function(){res.status(400).send(info);}, 4000);
    } else {

      _signin(authenticated_user, req, function(err, user) {

        if (err) {

          console.error('Error in signin method with user "%s"',
            authenticated_user['_id'], err);
          return res.status(400).send(err);
        }

        console.log('User logged in successfully', user);
        res.jsonp(user);
      });
    }
  })(req, res, next);
};

/**
 * Log out an user if already logged in
 */
export function signout(req, res) {

  console.log('User logged out successfully', req.user);

  req.logout();

  return res.status(200).end();

};

/**
 * Creates a new user by name and email
 */
var _signup = function(fullname, email, callback) {

  var user_data, user;

  user_data = user_utils.parseFullName(fullname);
  user_data.password = user_utils.generateRandomCode();
  user_data.email = email;
  user_data.role = 'employee';
  user_data._provider = 'local';

  user = new userDB(user_data);

  return user.save(function(err, user) {

    callback(err, user, user_data.password);

  });

};

/**
 * Register a new user and then login it
 * It is not necessary to authenticate hence its created
 */
export function signup(req, res, next) {

  _signup(req.body['fullname'], req.body['email'], function(err, signup_user,
    plainPassword) {

    if (err || !signup_user) {

      console.error('User could not be created', err);

      return res.status(400).end();
    }

    console.log('User created', req.body);

    _signin(signup_user, req, function(err, user) {

      if (err || !user) {

        console.error(
          'Error in signin method after signing up with user "%s"',
          signup_user['_id'], err);
        return res.status(400).end();
      }

      console.log('User logged in successfully', user);
      res.jsonp(user);
    });

    //Send email
    if (settings.get('user.signup.sendEmailOnSignup')) {

      signup_user.sendMail(settings.get('user.signup.mail'), {
        password: plainPassword
      }, function(err, res) {

        if (err) {

          return console.error(
            'Signup email could not be sent to user "%s"', signup_user[
              '_id'], err);
        }

        console.log('Signup email was sent to the user', signup_user);
      });
    }
  });
};
