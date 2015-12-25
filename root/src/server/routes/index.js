'use strict';

/**
 * Module dependencies.
 */

export default function(app) {

  // Load main route in last term
  app.get('/*', function(req, res, next) {

    res.render('index', {
      user: req.user || null
    }, function(err, html) {

      if (err) {

        err.info = 'Could not server index page';
        return next(err);
      }

      console.log('Serving index');

      res.send(html);
    });

  });

  // 500 error middleware
  app.use(function(err, req, res) {

    if (err) {

      // Send it to the logger. A 500 error should never comes up!
      console.error('FATAL ERROR: we are rendering a 500 page error', err);

      if (err.json === true) {

        return res.status(500).json(err);
      }

      res.render('500', {
        error: err.stack
      });
    }
  });

};
