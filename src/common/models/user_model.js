'use strict';

/**
 * Module dependencies.
 */
import mongoose from 'mongoose';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';
import _ from 'lodash';
import path from 'path';
import consolidate from 'consolidate';
import settings from '../../settings/init';

const Schema = mongoose.Schema;

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
  return ((this._provider !== 'local' && !this.updated) || (property &&
    property.length));
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {

  return (this._provider !== 'local' || (password && password.length >=
    settings.get('user.signup.minimunPasswordLength')));
};

/**
 * User Schema
 */
var userSchema = new Schema({

  'firstname': {

    type: String,
    trim: true,
    required: true,
    validate: [validateLocalStrategyProperty,
      'Introduce tu nombre de usuario'
    ],
    match: [/^[a-zA-Z]([a-zA-Z\ ])*$/,
      'El nombre de usuario debe ser así: nombre.apellido'
    ]
  },
  'lastname': {

    type: String,
    trim: true,
    match: [/^[a-zA-Z]([a-zA-Z\ ])*$/,
      'El nombre de usuario debe ser así: nombre.apellido'
    ]
  },
  'username': {

    type: String,
    trim: true,
    required: true,
    unique: true,
    validate: [validateLocalStrategyProperty,
      'Introduce tu nombre de usuario'
    ],
    match: [/^([a-zA-Z]+)(\.([a-zA-Z]+))?$/,
      'El nombre de usuario debe ser así: nombre.apellido'
    ]
  },
  'email': {

    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    validate: [validateLocalStrategyProperty,
      'Introduce tu correo electrónico'
    ],
    match: [/.+\@.+\..+/, 'Ojú... una dirección de correo!']
  },
  'password': {

    type: String,
    trim: true,
    required: true,
    validate: [validateLocalStrategyPassword,
      'La contraseña tiene que ser mas larguita'
    ]
  },
  'role': {

    type: String,
    trim: true,
    required: true,
    validate: [validateLocalStrategyProperty, 'No has asignado ningún rol'],
    match: [/^[a-zA-Z]+$/,
      'El nombre de usuario debe ser así: nombre.apellido'
    ]
  },
  'phone': {

    type: String,
    trim: true
  },
  'actived': {

    type: Boolean,
    require: true,
    default: true
  },
  //ISO 639-2
  'language': {

    type: String,
    require: true,
    default: 'spa'
  },
  //'signup_date': {}, --> Same as mongo date generated field
  'signin_date': {

    type: Date,
    require: true,
    default: new Date()
  },
  'signin_ip': {

    type: String,
    require: true,
    default: '0.0.0.0'
  },
  'signin_ua': {

    type: String,
    require: true,
    default: ''
  },
  '_forgot_code': {
    type: String
  },
  '_forgot_code_expire': {
    type: Date
  },
  '_salt': {
    type: String
  },
  '_provider': {
    type: String
  },
});

/**
 * Hook a pre save method to hash the password
 */
userSchema.pre('save', function(next) {

  if (this.password && this.password.length >= settings.get(
    'user.signup.minimunPasswordLength')) {

    //More secure: this._salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
    this._salt = new Buffer(crypto.randomBytes(16)).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
userSchema.methods.hashPassword = function(password) {

  if (this._salt && password) {

    return crypto.pbkdf2Sync(password, this._salt, 10000, 64).toString('base64');
  } else {

    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
userSchema.methods.authenticate = function(password) {
  return this.password === this.hashPassword(password);
};

/**
 * Send email to user
 * @todo use general sendMail function defined in common/lib/system/common.js
 */
userSchema.methods.sendMail = function(options, context, callback) {

  if (!settings.get('enableOutgoingEmails')) {

    return callback({
      err: 'Outgoing Emails are not enabled!'
    });
  }

  options = options || {};
  context = context || {};
  callback = callback || function(err, response) {if(err) console.error(err);};

  const smtp = nodemailer.createTransport(smtpTransport(settings.get('smtp')));

  options.to = this.email;
  options.text = `Your username is ${this.username} and the password is ${context.password}`;

  if (!options.template) {

    smtp.sendMail(options,
      function(err, response) {
        smtp.close();
        callback(err, response);
      });

    return;
  }

  consolidate[settings.get('templateEngine')](

    path.join(__dirname, '..', '..', 'server', 'templates', 'email', options.template),
    _.extend(context, {_user: this}),
    (error, html) => {

      if (error) return callback(error, null);

      options.html = html;

      smtp.sendMail(options,
        function(err, response) {
          smtp.close();
          callback(err, response);
        });

    });

};

/**
 * Find possible not used username
 */
userSchema.statics.findUniqueUsername = function(username, suffix, callback) {
  var _this = this;
  var possibleUsername = username + (suffix || '');

  _this.findOne({
    username: possibleUsername
  }, function(err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

/**
 * @return {Object} with just the password or the password and the new salt
 */
userSchema.statics.generateHashPassword = function(password, salt) {

  if (salt) {

    return {
      'password': crypto.pbkdf2Sync(password, salt, 10000, 64).toString(
        'base64')
    };
  }

  return new(function() {

    this._salt = new Buffer(crypto.randomBytes(16)).toString('base64');
    this.password = crypto.pbkdf2Sync(password, this._salt, 10000, 64).toString(
      'base64');

  })();

};
// userSchema.path('email').validate(function(value){

//   return /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(value);

// }, 'Invalid email');

// userSchema.path('password').validate(function(value){

//   return value.length >= 8;

// }, 'Invalid password');

export default mongoose.model('User', userSchema);
