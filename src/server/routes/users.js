'use strict';

/**
 * Module dependencies.
 */
import {authorization, authenticate} from '../../common/controllers/users/index';

export default function(app) {

  app.route('/api/user/signin')
    .post(authorization.requiresLogout, authenticate.signin);

  // app.route('/api/user/signout')
  //   .post(users.requiresLogin, users.signout);

  app.route('/api/user/signup')
    .post(authorization.requiresLogout, authenticate.signup);

  // app.route('/api/user/password/forgot')
  //   .post(users.requiresLogout, users.forgot);
  //
  // app.route('/api/user/edit')
  //   .post(users.requiresLogin, users.editUser);

};
