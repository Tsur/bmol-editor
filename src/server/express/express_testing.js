'use strict';

/**
 * Module dependencies.
 */
// var express = require('express');
// var expressLogger = require('express-bunyan-logger');
// var compress = require('compression');
// var path = require('path');

module.exports = function(app) {

  // Disable views cache
  // app.set('view cache', false);

  // Should be placed before express.static
  // app.use(compress({

  //   filter: function(req, res) {

  //     return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));

  //   },

  //   level: 9

  // }));

  // Enable logger (bunyan-express)
  // app.use(expressLogger({

  //   format: ':remote-address - :user-agent[major] custom logger'

  // }));

  // Setting the app router and static folder
  // app.use('/static', express.static(path.resolve('./public')));

};