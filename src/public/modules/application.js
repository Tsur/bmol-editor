'use strict';

import settings from '../../settings/init';
import config from '../config/app';

export default function(){

  //S tart by defining the main module and adding the module dependencies
  angular.module(settings.get('applicationModuleName'), settings.get('applicationModuleVendorDependences'));

  // Setting HTML5 Location Mode
  angular.module(settings.get('applicationModuleName')).config(config);

  //Then define the init function for starting up the application
  angular.element(document).ready( event => {

    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') {

      window.location.hash = '#!';

    }

    //Then init the app
    angular.bootstrap(document, [settings.get('applicationModuleName')]);

  });

}
