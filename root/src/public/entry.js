'use strict';

import jquery from 'jquery';

// Import application
import initApplication from './modules/application';

// Import application modules
import initCoreModule from './modules/core/application';

window.onload = event => {

    window.jQuery = window.$ = jquery;

    initApplication();
    initCoreModule();

};
