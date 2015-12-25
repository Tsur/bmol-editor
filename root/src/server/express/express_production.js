'use strict';

/**
 * Module dependencies.
 */
var helmet = require('helmet'),
	settings = require('config');

module.exports = function(app, db) {

    // Enable views cache
    app.set('view cache', true);
    app.locals.cache = 'memory';
    app.disable('x-powered-by');

    // Use helmet to secure Express headers
    app.use(helmet.xframe());
    app.use(helmet.xssFilter());
    app.use(helmet.nosniff());
    app.use(helmet.ienoopen());

    // Maintenance middleware come into scene
    app.use(function (req, res, next) {

        coreLogger.debug('we are rendering a 404 not found page error');

        if (settings.maintenance) {

            return res.render('maintenance');
        }

        next();

    });

		app.use('/dist', express.static(path.join(__dirname,'..', '..', 'dist')));

};
