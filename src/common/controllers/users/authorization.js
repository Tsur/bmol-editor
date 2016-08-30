'use strict';

/**
 * Module dependencies.
 */
import * as roles from '../../helpers/roles';

/**
 * Require login routing middleware
 */
export function requiresLogin(req, res, next) {

  if (!req.isAuthenticated()) {

    console.error('User not authenticated', req.headers);
    return res.status(401).send({
      message: 'User is not logged in'
    });

  }

  next();

};

/**
 * Require logout routing middleware
 */
export function requiresLogout(req, res, next) {

  console.log('hi!!11');

  if (req.isAuthenticated()) {

    console.error('User is authenticated', req.headers);
    return res.status(401).send({
      message: 'User is logged in'
    });
  }

  next();
};

/**
 * User authorizations routing middleware
 */
export function hasAuthorization(role) {

  var _this = this;

  return function(req, res, next) {

    _this.requiresLogin(req, res, function() {

      //if (_.intersection(req.user.roles, roles).length) {
      if (roles[req.user.role] === roles[role]) {

        return next();
      } else {

        console.error('User is not authorized (role "%s" is not "%s" )',
          req.user.role, role, req);
        return res.status(403).send({
          message: 'User is not authorized'
        });
      }
    });
  };
};
