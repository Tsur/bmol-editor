'use strict';

/**
 * Module dependencies.
 */
import settings from '../../settings/init';
import express from 'express';
import path from 'path';
import consolidate from 'consolidate';
import bodyParser from 'body-parser';
import compress from 'compression';
import methodOverride from 'method-override';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from 'passport';
import flash from 'connect-flash';
import mongoose from 'mongoose';

export default function(app) {

  const MongoStore = require('connect-mongo')(session);

  /*
   * Express configuration
   */
  // app.locals.application = settings.index;

  app.set('showStackError', true);

  // template engine
  app.engine('html', consolidate[settings.get('templateEngine')]);
  app.set('view engine', 'html');
  app.set('views', settings.get('templateLocation'));

  // Allow to use req.ip & req.ips
  app.enable('trust proxy');
  app.enable('jsonp callback');

  /*
   * Express middlewares
   */

  // Passing the request url to environment locals
  app.use(function(req, res, next) {

    res.locals.url = req.protocol + '://' + req.headers.host + req.url;

    next();

  });

  // Request body parsing middleware should be above methodOverride
  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());
  app.use(methodOverride());

  // CookieParser should be above session
  app.use(cookieParser());

  // Express MongoDB session storage
  app.use(session({
    saveUninitialized: true,
    resave: true,
    secret: settings.get('session.secret'),
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      collection: settings.get('session.collection')
    }),
    cookie: settings.get('session.cookie.config'),
    name: settings.get('session.cookie.name')
  }));

  app.use(passport.initialize());
  app.use(passport.session());
  app.use(flash());

  app.use(compress({

    filter: function(req, res) {

      return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));

    },

    level: 9

  }));

  app.use('/dist', express.static(path.join(__dirname,'..', '..', 'dist')));

};
