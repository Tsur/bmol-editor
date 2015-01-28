'use strict';

/**
 * Module dependencies.
 */

var core = require('./../controllers/core/api');

module.exports = function(app) {

  var Routes = require('./../lib/routes')(app);

  // Routes.create('api/dashboard/summary', dashboard.summary);

  Routes.http('/api/bmol/data', core.entities);

  // Routes.io('api:dashboard:summary', dashboard.summary);

};