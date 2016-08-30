'use strict';

import settings from '../../settings/init';

// Add a new vertical module
export const registerModule = function(moduleName, dependencies) {
  // Create angular module
  angular.module(moduleName, dependencies || []);

  // Add the module to the AngularJS configuration file
  angular.module(settings.get('applicationModuleName')).requires.push(moduleName);

}
