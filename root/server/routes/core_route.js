'use strict';

/**
 * Module dependencies.
 */

var core = require('./../controllers/core/api');

module.exports = function(app) {

  var Routes = require('./../lib/routes')(app);

  // Routes.create('api/dashboard/summary', dashboard.summary);

  Routes.create('api/bmol/entities', core.entities);

  Routes.create('api/bmol/palette', core.palette);

  // Routes.http('/api/bmol/data', core.entities);

  // Routes.io('api:dashboard:summary', dashboard.summary);

};