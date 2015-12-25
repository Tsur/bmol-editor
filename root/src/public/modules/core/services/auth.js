'use strict';

import * as globalRoles from '../../../../common/helpers/roles';
import settings from '../../../../settings/init';

function updateUser(user, userRoles){

  user = user || { username: '', role: 'public'};

  user.role = userRoles[user.role];

  return user;

}

class Auth {

  constructor($http, $rootScope){

    this.me = {};

    // this.rx = rx;
    this.$http = $http;
    this.$rootScope = $rootScope;

    this.me = window.sessionStorage.user ? JSON.parse(window.sessionStorage.user) :
      { username: '', role: globalRoles.userRoles['public']};

    // if (window.__user) window.__user = undefined;

    //Make binary AND operation i.e. role.bitMask = 010b (2), accessLevel.bitMask = 110b (6)
    //010 AND 110 = 010

  }

  accessLevels(){ return globalRoles.accessLevels }

  userRoles(){ return globalRoles.userRoles }

  user(){ return this.me }

  authorize(accessLevel, role) {

    role = role || this.me.role;

    return accessLevel.bitMask & role.bitMask;
  }

  isLoggedIn() {

    //if user is an employee or an admin then is logged in, otherwise not
    return this.me.role.title == globalRoles.userRoles.employee.title || this.me.role.title ==
      globalRoles.userRoles.admin.title;
  }

  signup(user, successFn, errorFn) {

    this.$http.post(settings.base('/api/user/signup'), user)
    .then(
      response => {

        const user = response.data;

        this.me = updateUser({username: user.username, role: user.role }, globalRoles.userRoles);

        window.sessionStorage.user = JSON.stringify(this.me);

        successFn(user);

      },
      error => errorFn(error)

    );

  }

  signin(user, successFn, errorFn) {

    this.$http.post(settings.base('/api/user/signin'), user)
    .then(
      response => {

        const user = response.data;

        this.me = updateUser({username: user.username, role: user.role }, globalRoles.userRoles);

        window.sessionStorage.user = JSON.stringify(this.me);

        successFn(user);

      },
      error => errorFn(error)

    );

    // subscriber.dispose();

  }
  //
  // logout(success, error) {
  //
  //   this.$http
  //     .post('/api/user/signout')
  //     .success(() => {
  //
  //       angular.extend(this.me, updateUser(null, globalRoles.userRoles));
  //
  //       success();
  //
  //     })
  //     .error(error);
  // }
  //
  // setUserName(username) {
  //
  //   var data = {
  //     before: this.me.username,
  //     current: this.me.username = username
  //   };
  //
  //   this.$rootScope.$broadcast('usernameChanged', data);
  //   //Note: If Changin EditUser to a new State(removing it from the Modal), delete $rootScope from
  //   //Auth service arguments and only keep changeUser(username); in this function
  // }

  static factory(AuthDispatcher, $rootScope){

    return new Auth(AuthDispatcher, $rootScope);

  }

}

Auth.factory.$inject = ['$http', '$rootScope'];

export default Auth;
