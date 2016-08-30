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
import MenuPaletteCtrl from './controllers/menu_palette';
import MapCtrl from './controllers/map';

// Import directives
import DropDownDirective from './directives/sui_dropdown';
import AccordionDirective from './directives/sui_accordion';
import DownloadDirective from './directives/download';
import UploadDirective from './directives/upload';
import FolderDropDirective from './directives/folderdrop';
import BaseMapDirective from './directives/basemap';
import GameMapDirective from './directives/gamemap';

// Import services
import AuthService from './services/auth';
import ClientsVersion from './services/clients_version';
import CanvasManager from './services/canvas_manager';
import SpritesManager from './services/sprites_manager';

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
  angular.module('core').controller('MenuPaletteCtrl', MenuPaletteCtrl);
  angular.module('core').controller('MapCtrl', MapCtrl);

  // Load directives
  angular.module('core').directive('suiAccordion', AccordionDirective);
  angular.module('core').directive('suiDropdown', DropDownDirective);
  angular.module('core').directive('downloadJson', DownloadDirective);
  angular.module('core').directive('uploadJson', UploadDirective);
  angular.module('core').directive('folderDrop', FolderDropDirective);
  angular.module('core').directive('baseMap', BaseMapDirective);
  angular.module('core').directive('gameMap', GameMapDirective);

  // Load filters


  // Load services
  angular.module('core').factory('Auth', AuthService.factory);
  angular.module('core').factory('ClientsVersion', ClientsVersion.factory);
  angular.module('core').factory('CanvasManager', CanvasManager.factory);
  angular.module('core').factory('SpritesManager', SpritesManager.factory);

  // Load routes
  angular.module(settings.applicationModuleName).config(routes);
  angular.module(settings.applicationModuleName).run(configure);

}
