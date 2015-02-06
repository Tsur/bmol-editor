'use strict';

var express = require('express')
var path = require('path');
// Bootstrap db connection
require('mongoose').connect('mongodb://localhost/bmol-dev', function(err) {

  if (err) {

    return console.error('Could not connect to MongoDB', err);
  }

  // Bootstrap the server application
  var app = express();

  app.use('/', express.static(path.resolve('./')));

  // app.engine('html', consolidate['swig']);
  // app.set('view engine', 'html');
  // app.set('views', './server/views');

  require('./server/routes/core_route')(app);

  // app.get('/*', function(req, res) {
  //
  //   res.render('index', {
  //     user: req.user || null
  //   }, function(err, html) {
  //
  //     if (err) {
  //
  //       err.info = 'Could not server index page';
  //       return next(err);
  //     }
  //
  //     console.debug('Serving index');
  //     res.send(html);
  //
  //   });
  //
  // });

  // Start the app by listening on <port>
  require('http').Server(app).listen(9090);

});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', function() {

  require('mongoose').connection.close(function() {

    console.log(
      'Mongoose default connection "%s" disconnected after server termination');

    process.exit(0);

  });

});
