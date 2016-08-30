'use strict';

import * as globalRoles from '../../../../common/helpers/roles';

// Note: You cannot inject services instances in the config, just providers. From angular docs: Configuration blocks - get executed during the provider registrations and configuration phase. Only providers and constants can be injected into configuration blocks. This is to prevent accidental instantiation of services before they have been fully configured
function routes($stateProvider){

    var access = globalRoles.accessLevels;

    $stateProvider
    .state('stock', {
      url: '/stock',
      parent: 'index',
      access: access.employee,
      controller: 'StockCtrl',
      templateUrl: './src/public/modules/stock/partials/stock.html'
    })
    .state('createStock', {
      url: '/stock/new',
      parent: 'index',
      access: access.employee,
      controller: 'CreateStockCtrl',
      templateUrl: './src/public/modules/stock/partials/create.html'
    });
}

routes.$inject = ['$stateProvider'];

export default routes;
