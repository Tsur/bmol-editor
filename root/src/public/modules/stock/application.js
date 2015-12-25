'use strict';

import {registerModule} from '../../../common/helpers/angular';

// Import controllers
import StockCtrl from './controllers/stock';
import CreateStockCtrl from './controllers/create_stock';

// Import directives

// Import services

// Import routes
import routes from './config/routes';

export default function(){

  // Register core module
  registerModule('stock');

  // Load controllers
  angular.module('stock').controller('StockCtrl', StockCtrl);
  angular.module('stock').controller('CreateStockCtrl', CreateStockCtrl);

  // Load directives

  // Load filters

  // Load services
  // require('./services/colors');

  // Load routes
  angular.module('kalzate').config(routes);

}
