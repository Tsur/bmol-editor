'use strict';

import * as globalRoles from '../../../../common/helpers/roles';

// Note: You cannot inject services instances in the config, just providers. From angular docs: Configuration blocks - get executed during the provider registrations and configuration phase. Only providers and constants can be injected into configuration blocks. This is to prevent accidental instantiation of services before they have been fully configured
function routes($stateProvider, $urlRouterProvider){

    var access = globalRoles.accessLevels;

    $stateProvider
      .state('index', {
        url: '/',
        access: access.anon,
        views: {
          'menu': {
            templateUrl: './src/public/modules/core/partials/menu.html'
          },
          'section': {
            templateUrl: './src/public/modules/core/partials/index.html'
          }
        }
      })
      // .state('identify', {
      //   access: access.anon,
      //   views: {
      //     section: {
      //       templateUrl: './src/public/modules/core/partials/security_check.html'
      //     }
      //   },
      //   controller: ['$scope',
      //     function($scope) {
      //       $scope.error = false;
      //       $scope.loading = false;
      //     }
      //   ],
      //   onExit: function() {
      //
      //     //Processing library still keeps a copy a "p", so p = undefined will not work because it is also referenced by processing
      //     window.animationData.p.noLoop();
      //
      //     //Free global unused memory
      //     window.animationData = undefined;
      //   }
      // })
      // .state('signin', {
      //   url: '/signin',
      //   parent: 'identify',
      //   templateUrl: './src/public/modules/core/partials/signin.html',
      //   controller: 'SigninCtrl',
      //   access: access.anon
      // })
      // .state('signup', {
      //   url: '/signup',
      //   parent: 'identify',
      //   templateUrl: './src/public/modules/core/partials/signup.html',
      //   controller: 'SignupCtrl',
      //   access: access.anon
      // })
      // .state('forgot', {
      //   url: '/forgot',
      //   parent: 'identify',
      //   templateUrl: './src/public/modules/core/partials/forgot.html',
      //   controller: 'ForgotCtrl',
      //   access: access.anon
      // })
      // .state('forgot_secure', {
      //   url: '/forgot',
      //   parent: 'identify',
      //   templateUrl: './src/public/modules/core/partials/forgot_secure.html',
      //   controller: 'ForgotCtrl',
      //   access: access.anon
      // });

    $urlRouterProvider.otherwise('/');
}

routes.$inject = ['$stateProvider', '$urlRouterProvider'];

export default routes;
