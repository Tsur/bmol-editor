'use strict';

// Note: You cannot inject services providers in the config, just instances. From angular docs: Run blocks - get executed after the injector is created and are used to kickstart the application. Only instances and constants can be injected into run blocks. This is to prevent further system configuration during application run time.

/**
* Note: checkout https://github.com/angular-ui/ui-router/issues/64
http://stackoverflow.com/questions/23585065/angularjs-ui-router-change-url-without-reloading-state
*
*/
function configure($rootScope, $state, Auth){

    $rootScope.$on("$stateChangeStart", function(event, toState, toParams, fromState, fromParams) {

      $rootScope.error = null;

      //console.log('toState', toState);
      //If client is not authorize to visit the "next" url, check if logged in
      //access variable in next.access is given by the $routeProvider.when({...access:});
      if (!Auth.authorize(toState.access)) {

        if (!Auth.isLoggedIn()) {

          //Keep track of the current path to redirect then to it
          $rootScope.transition = toState.name;
          
          $state.go('signin');

        }
        //If user is already logged in and try to enter to login page
        else {

          $state.go('index');

        }

        return event.preventDefault();

      }

    });

}

configure.$inject = ['$rootScope', '$state', 'Auth'];

export default configure;
