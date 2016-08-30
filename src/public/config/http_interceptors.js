'use strict';

function responseInterceptor($location, $q) {

  return {

    response: function(response) {
      // do something on success
      return response;
    },

    // optional method
   responseError: function(rejection) {

     if (rejection.status === 401) {
       $location.path('/signin');
     }

     return $q.reject(rejection);

    }

  };

}

responseInterceptor.$inject = ['$location', '$q'];

export default responseInterceptor;
