'use strict';

import * as globalRoles from '../../../../common/helpers/roles';

// Note: You cannot inject services instances in the config, just providers. From angular docs: Configuration blocks - get executed during the provider registrations and configuration phase. Only providers and constants can be injected into configuration blocks. This is to prevent accidental instantiation of services before they have been fully configured
function routes($stateProvider){

    var access = globalRoles.accessLevels;

    $stateProvider
    .state('sales', {
      url: '/sales',
      parent: 'index',
      access: access.employee,
      controller: 'SalesCtrl',
      templateUrl: './src/public/modules/sales/partials/sales.html'
    });
}

routes.$inject = ['$stateProvider'];

export default routes;
