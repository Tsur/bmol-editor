'use strict';

var path = require('path');
var secrets = require('../../server/data/secrets');
var Utils = require('../../server/lib/utils');

module.exports = {

  rootPath: path.normalize(__dirname + '/../..'),

  port: 9090,

  hostname: 'localhost',

  db: 'mongodb://localhost/bmol',

  maintenance: false,

  env: 'development',

  loggers: 'development',

  smtp: {

    service: "Gmail",
    auth: {

      'user': secrets.SEND_MAIL_USER || process.env.SEND_MAIL_USER || '',
      'pass': secrets.SEND_MAIL_PASSWD || process.env.SEND_MAIL_PASSWD || ''
    }

  },

  website: {

    title: 'BMoL - Editor',
    keywords: 'bmol, editor, map, game',
    description: '',
    favicon: '/static/favicon-dev.ico',
    assets: Utils.getAssets(require('../../public/config/assets').development)

  },

  rendering: {

    engine: 'swig',
    type: 'html'

  },

  sessions: {

    sessionSecret: 'SESSION_SECRET',

    sessionCollection: 'sessions',

    sessionName: 'bmol.sid',

    sessionCookie: {

      path: '/',
      httpOnly: true,
      // If secure is set to true then it will cause the cookie to be set
      // only when SSL-enabled (HTTPS) is used, and otherwise it won't
      // set a cookie. 'true' is recommended yet it requires the above
      // mentioned pre-requisite.
      secure: false,
      // Only set the maxAge to null if the cookie shouldn't be expired
      // at all. The cookie will expunge when the browser is closed.
      maxAge: null
    },

    sessionCookieName: 'bmol.connect.sid'

  }

};