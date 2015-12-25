'use strict';

import path from 'path';
import * as secret from './secrets';

export default {


  // Init module configuration options
  applicationModuleName: 'rmejs',
  // export const applicationModuleVendorDependences = ['ngCookies', 'ngResource',
  //   'ngAnimate', 'ngTouch', 'ngSanitize', 'ui.router', 'ui.bootstrap',
  //   'ui.utils'
  // ];
  applicationModuleVendorDependences: ['ui.router'],

  env: 'development',

  loggers: 'development',

  enableOutgoingEmails: true,

  port: 3000,

  hostname: 'localhost',

  base: function(url){ return 'http://'+this.hostname+':'+this.port + url;},

  maintenance: false,

  session: {

    secret: 'RMEJS_SESSION_SECRET',

    collection: 'sessions',

    cookie: {

      name: 'rme.connect.sid',
      config: {

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
      }
    }

  },

  smtp: {

    service: 'Gmail',
    auth: {

      'user': process.env.EMAIL_USER || secret.EMAIL_USER || '',
      'pass': process.env.EMAIL_PASSWORD || secret.EMAIL_PASSWORD  || ''
    }

  },

  templateEngine: 'swig',
  templateLocation: __dirname + '/../server/templates',

  user: {

    recover: {

      mailCode: {

        from: 'tantest@noreply.com',
        subject: 'RME-JS: Recupera Contraseña',
        template: 'views/templates/forgot_request_code_email.html',
        attachments: [{
          filename: 'email_logo.png',
          path: __dirname +
            '/../../../media/img/common/email_logo.png',
          cid: 'kalzate@signup.logo' //same cid value as in the html img src
        }]
      },
      mailPassword: {

        from: 'tantest@noreply.com',
        subject: 'RME-JS: Recupera Contraseña',
        template: 'views/templates/forgot_send_password_email.html',
        attachments: [{
          filename: 'email_logo.png',
          path: __dirname +
            '/../../../media/img/common/email_logo.png',
          cid: 'kalzate@signup.logo' //same cid value as in the html img src
        }]
      },
      passwdPattern: 'xxxxxxxxxxxxxxxx',
      codeExpiringTime: 2 * 60 //in minutes
    },

    signup: {

      sendEmailOnSignup: true,
      minimunPasswordLength: 8,
      mail: {

        // Templates not metting different criterias (websites, emails, ...) seems to make gmail to reject the message
        from: 'tantest@noreply.com',
        subject: 'RME-JS: Datos de Registro',
        template: 'signup_email_plain.html'
        // template: 'templates/email/signup_email.html'
        // attachments: [{
        //   filename: 'email_logo.png',
        //   path: path.join(__dirname, '..', '..', '..', '..', 'media', 'img', 'common', 'email_logo.png'),
        //   cid: 'kalzate@signup.logo' //same cid value as in the html img src
        // }]
      }
    }

  }

};
