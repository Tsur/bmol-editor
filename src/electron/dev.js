"use strict";

import path from 'path';
import app from 'app';
import BrowserWindow from 'browser-window';
import shell from 'shell';
// import server from '../server/index';

const TITLE = 'Bmol - dev';
let mainWindow = null;

// Quit when all windows are closed.
app.on('window-all-closed', function() {

    if (process.platform != 'darwin') app.quit();

});

// This method will be called when Electron has done everything
// initialization and ready for creating browser windows.
app.on('ready', function() {

    // Create the browser window, .
    mainWindow = new BrowserWindow({
        //'transparent': true,
        'auto-hide-menu-bar':true,
        //frame: false,
        //'skip-taskbar': true,
        title: TITLE,
        center: true,
        //'fullscreen': true,
        'web-preferences': {

          'web-security': false

        }
    });

    // Emitted when the window is closed.
    mainWindow.on('closed', function() {

        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        mainWindow = null;

    });

    // server({}, function(error){
    //
    //   if(error){
    //
    //     var dialog = require('dialog');
    //
    //     dialog.showErrorBox(
    //
    //
    //       "Error: " + error.toString(),
    //       "This software requires mongodb in order to work. Please, contact your administrator to run it on default host and port."
    //
    //     );
    //
    //     return app.quit();
    //   }

      // mainWindow.loadURL('http://localhost:3000');
      mainWindow.loadURL(path.join('file://', __dirname, '..', '..', 'index-desktop.html'));

      // Open the devtools.
      mainWindow.openDevTools();


      // Open it maximized
      mainWindow.maximize();

    // })

});
