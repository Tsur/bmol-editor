#!/usr/bin/env node

module.exports = exports = {

  development: {

    removeRoot: 'public/',

    prepend: '/static/',

    vendor: {

      css: [
        //'public/vendor/bootstrap/dist/css/bootstrap.css',
        //'public/vendor/bootstrap/dist/css/bootstrap-theme.css',
      ],

      js: [
        'public/vendor/jquery/jquery.min.js',
        'public/vendor/angular/angular.js',
        // 'public/vendor/angular-resource/angular-resource.js', 
        'public/vendor/angular-cookies/angular-cookies.js',
        // 'public/vendor/angular-animate/angular-animate.js', 
        // 'public/vendor/angular-touch/angular-touch.js', 
        'public/vendor/angular-sanitize/angular-sanitize.js',
        'public/vendor/angular-ui-router/release/angular-ui-router.js',
        // 'public/vendor/angular-ui-utils/ui-utils.js',
        'public/vendor/angular-bootstrap/ui-bootstrap-tpls.js',
        // 'public/vendor/processing/processing.min.js'
      ]
    },

    css: [
      'public/modules/**/css/*.css'
    ],

    js: [
      'public/config/roles.js',
      'public/config/config.js',
      'public/application.js',
      'public/modules/*/[!\_]*.js',
      'public/modules/*/*[!tests]*/[!\_]*.js',
      /* if wanna cached templates */
      //'public/dist/templates.js'
    ],

    tests: [
      'public/vendor/angular-mocks/angular-mocks.js',
      'public/modules/*/tests/*.js'
    ]

  },

  production: {

    removeRoot: 'public/',

    prepend: '/static/',

    vendor: {

      //CDN
      css: [
        'public/vendor/bootstrap/dist/css/bootstrap.css',
        'public/vendor/bootstrap/dist/css/bootstrap-theme.css',
      ],

      //CDN
      js: [
        'public/vendor/angular/angular.js',
        'public/vendor/angular-resource/angular-resource.js',
        'public/vendor/angular-cookies/angular-cookies.js',
        'public/vendor/angular-animate/angular-animate.js',
        'public/vendor/angular-touch/angular-touch.js',
        'public/vendor/angular-sanitize/angular-sanitize.js',
        'public/vendor/angular-ui-router/release/angular-ui-router.js',
        'public/vendor/angular-ui-utils/ui-utils.js',
        'public/vendor/angular-bootstrap/ui-bootstrap-tpls.js'
      ]
    },

    css: ['public/dist/application.min.css'],

    js: ['public/dist/application.min.js']
  }
};