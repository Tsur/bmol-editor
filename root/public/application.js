'use strict';

//Start by defining the main module and adding the module dependencies
angular.module(ApplicationConfiguration.applicationModuleName, ApplicationConfiguration.applicationModuleVendorDependencies);

// Setting HTML5 Location Mode
angular.module(ApplicationConfiguration.applicationModuleName).config(['$locationProvider', '$httpProvider',
  function($locationProvider, $httpProvider) {

    $locationProvider.hashPrefix('!');
    $locationProvider.html5Mode(true);

    var interceptor = ['$location', '$q',
      function($location, $q) {

        function success(response) {
          return response;
        }

        function error(response) {

          if (response.status === 401) {
            $location.path('/signin');
          }

          return $q.reject(response);
        }

        return function(promise) {

          return promise.then(success, error);
        }
      }
    ];

    $httpProvider.responseInterceptors.push(interceptor);
  }
]);

//Then define the init function for starting up the application
angular.element(document).ready(function() {
  //Fixing facebook bug with redirect
  if (window.location.hash === '#_=_') {
    window.location.hash = '#!';
  }

  //Then init the app
  angular.bootstrap(document, [ApplicationConfiguration.applicationModuleName]);
});