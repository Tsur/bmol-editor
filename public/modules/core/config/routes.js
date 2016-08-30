'use strict';

// Note: You cannot inject services instances in the config, just providers. From angular docs: Configuration blocks - get executed during the provider registrations and configuration phase. Only providers and constants can be injected into configuration blocks. This is to prevent accidental instantiation of services before they have been fully configured
angular.module('bmol.core')
  .config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

      var access = globalRoles.accessLevels;

      $stateProvider
        .state('index', {
          url: "/",
          templateUrl: '/static/modules/core/partials/map.html',
          controller: 'MapCtrl',
          access: access.anon
        })
        .state('error404', {
          url: "/404",
          templateUrl: '/static/modules/core/partials/404.html',
          access: access['public']
        });

      $urlRouterProvider.otherwise("/404");
    }
  ]);


// Note: You cannot inject services providers in the config, just instances. From angular docs: Run blocks - get executed after the injector is created and are used to kickstart the application. Only instances and constants can be injected into run blocks. This is to prevent further system configuration during application run time.

/**
* Note: checkout https://github.com/angular-ui/ui-router/issues/64
http://stackoverflow.com/questions/23585065/angularjs-ui-router-change-url-without-reloading-state
* 
*/
angular.module('bmol.core')
  .run(['$rootScope', '$location', 'Auth',
    function($rootScope, $location, Auth) {

      $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {

        $rootScope.error = null;

        //console.log('toState', toState);
        //If client is not authorize to visit the "next" url, check if logged in
        //access variable in next.access is given by the $routeProvider.when({...access:});
        if (!Auth.authorize(toState.access)) {

          if (!Auth.isLoggedIn()) {

            //Keep track of the current path to redirect then to it
            $rootScope.transition = $location.path();
            //$state.go('signin');
            $location.path('/signin');
          }
          //If user is already logged in and try to enter to login page
          else {

            $location.path('/');
          }

          //event.preventDefault();
        }
      });
    }
  ]);