'use strict';

import settings from '../../../settings/init';
import {registerModule} from '../../../common/helpers/angular';

// Import controllers
// import HeaderCtrl from './controllers/header';
// import FooterCtrl from './controllers/footer';
// import ForgotCtrl from './controllers/forgot';
// import ProfileCtrl from './controllers/profile';
// import SigninCtrl from './controllers/signin';
// import SignupCtrl from './controllers/signup';
import MenuCtrl from './controllers/menu';
import MapCtrl from './controllers/map';

// Import directives
import BaseMapDirective from './directives/basemap';

// Import services
import AuthService from './services/auth';

// Import routes
import routes from './config/routes';
import configure from './config/configure';

export default function(){

  // Register core module
  registerModule('core');

  // Load controllers
  // angular.module('core').controller('HeaderCtrl', HeaderCtrl);
  // angular.module('core').controller('FooterCtrl', FooterCtrl);
  // angular.module('core').controller('ForgotCtrl', ForgotCtrl);
  // angular.module('core').controller('ProfileCtrl', ProfileCtrl);
  // angular.module('core').controller('SigninCtrl', SigninCtrl);
  // angular.module('core').controller('SignupCtrl', SignupCtrl);
  angular.module('core').controller('MenuCtrl', MenuCtrl);
  angular.module('core').controller('MapCtrl', MapCtrl);

  // Load directives
  angular.module('core').directive('baseMap', BaseMapDirective.factory);

  // Load filters

  // Load services
  angular.module('core').factory('Auth', AuthService.factory);

  // Load routes
  angular.module(settings.applicationModuleName).config(routes);
  angular.module(settings.applicationModuleName).run(configure);

}
