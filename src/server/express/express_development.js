'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
// var expressLogger = require('express-bunyan-logger');
import compress from 'compression';
import path from 'path';

export default function(app) {

  // Disable views cache
  app.set('view cache', false);

  // Should be placed before express.static
  app.use(compress({

    filter: function(req, res) {

      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));

    },

    level: 9

  }));

  // Enable logger (bunyan-express)
  // app.use(expressLogger({

  //   format: ':remote-address - :user-agent[major] custom logger'

  // }));

  // Setting the app router and static folder
  app.use('/dist', express.static(path.join(__dirname,'..', '..', 'dist')));

};
