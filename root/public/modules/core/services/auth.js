'use strict';

/* Services */
angular.module('bmol.core')
  .factory('Auth', ['$http', '$rootScope',
    function($http, $rootScope) {

      var userRoles = globalRoles.userRoles,
        me = {};

      var updateUser = function(user) {

        user = user || {
          username: '',
          role: 'public'
        };

        user.role = userRoles[user.role];

        angular.extend(me, user);
      };

      updateUser(window.__user);

      if (window.__user) {

        window.__user = undefined;
      }

      return {

        //Make binary AND operation i.e. role.bitMask = 010b (2), accessLevel.bitMask = 110b (6)
        //010 AND 110 = 010
        authorize: function(accessLevel, role) {

          role = role || me.role;

          return accessLevel.bitMask & role.bitMask;
        },

        isLoggedIn: function() {

          //if user is an employee or an admin then is logged in, otherwise not
          return me.role.title == userRoles.employee.title || me.role.title == userRoles.admin.title;
        },

        register: function(user, success, error) {
          $http
            .post('/api/user/signup', user)
            .success(function(user) {
              updateUser(user);
              success();
            })
            .error(error);
        },

        login: function(user, success, error) {
          //console.log(user);

          $http
            .post('/api/user/signin', user)
            .success(function(user) {
              updateUser(user);
              success();
            })
            .error(error);
        },

        logout: function(success, error) {
          $http
            .post('/api/user/signout')
            .success(function() {
              updateUser();
              success();
            })
            .error(error);
        },

        setUserName: function(username) {
          var data = {
            before: me.username,
            current: me.username = username
          };
          $rootScope.$broadcast('usernameChanged', data);
          //Note: If Changin EditUser to a new State(removing it from the Modal), delete $rootScope from
          //Auth service arguments and only keep changeUser(username); in this function
        },

        accessLevels: globalRoles.accessLevels,

        userRoles: userRoles,

        user: me
      };
    }
  ]);