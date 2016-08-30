'use strict';

import {registerModule} from '../../../common/helpers/angular';

// Import controllers
import SalesCtrl from './controllers/sales';

// Import directives

// Import services

// Import routes
import routes from './config/routes';

export default function(){

  // Register core module
  registerModule('sales');

  // Load controllers
  angular.module('sales').controller('SalesCtrl', SalesCtrl);

  // Load directives

  // Load filters

  // Load services
  // require('./services/colors');

  // Load routes
  angular.module('kalzate').config(routes);

}
