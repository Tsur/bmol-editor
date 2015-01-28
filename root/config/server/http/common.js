'use strict';

/**
 * Module dependencies.
 */
var settings = require('config');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var timeout = require('connect-timeout');
var consolidate = require('consolidate');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var connectMongo = require('connect-mongo');

module.exports = function(app, db) {

  /*
   * Express configuration
   */

  /* Express View/Assets Settings */

  app.locals.website = settings.get('website');
  app.engine(settings.get('rendering.type'), consolidate[settings.get('rendering.engine')]);
  app.set('view engine', 'html');
  app.set('views', './server/views');

  /* Express Options */

  app.set('showStackError', true);

  // Allow to use req.ip & req.ips
  app.enable('trust proxy');
  app.enable('jsonp callback');

  /* Express middlewares */

  //@todo 20 minutes timeout!!! -> check celery or something like that!!!!!
  app.use(timeout('1200s'));

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

  // Lets you use HTTP verbs such as PUT or DELETE
  app.use(methodOverride());

  /* Express sessions */

  // CookieParser should be above session
  app.use(cookieParser());

  // Express MongoDB session storage
  var mongoStore = connectMongo({

    session: session

  });

  var sessionMiddleware = session({

    saveUninitialized: false,
    resave: false,
    secret: settings.get('sessions.sessionSecret'),
    store: new mongoStore({
      db: db.connection.db,
      collection: settings.get('sessions.sessionCollection')
    }),
    cookie: settings.get('sessions.sessionCookie'),
    name: settings.get('sessions.sessionCookieName')

  });

  app.use(sessionMiddleware);

  app.use(passport.initialize());

  app.use(passport.session());

  /* Flash messages */

  app.use(flash());

};