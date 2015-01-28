'use strict';

var bunyanEmailStream = require('bunyan-emailstream').EmailStream;
var bunyanLogglyStream = require('bunyan-loggly').Bunyan2Loggly;

module.exports = {

  core: {

    name: 'core',
    src: true,
    streams: [
      // Loggly
      {
        type: 'raw',
        stream: new bunyanLogglyStream({
          token: 'your-account-token',
          subdomain: 'your-sub-domain'
        }),
        level: 'error'
      },
      // Email
      {
        type: 'raw',
        stream: new EmailStream({
          to: 'me@example.com'
        }),
        level: 'error'
      }
    ]
  }

};