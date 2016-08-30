'use strict';

import responseInterceptor from './http_interceptors';

function configProviders($locationProvider, $httpProvider) {

  //$locationProvider.hashPrefix('!');
  //$locationProvider.html5Mode(true);

  $httpProvider.interceptors.push(responseInterceptor);

  // $httpProvider.interceptors.push(function ($q) {
  //      return {
  //          request: function (config) {
  //              config.url = 'http://localhost:3000/' + config.url;
  //              return config || $q.when(config);
  //
  //          }
  //      }
  //  });
};

configProviders.$inject = ['$locationProvider', '$httpProvider'];

export default configProviders;
