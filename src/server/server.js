'use strict';

/**
 * Module dependencies.
 */
import path from 'path';
import settings from '../settings/init';
import usersRoutes from './routes/users';
import indexRoutes from './routes/index';
import http from './http';

export default function(fn) {

  // load routing files if existing
  usersRoutes(http);

  indexRoutes(http);

  // listen to
  http.listen(settings.get('port'), fn);

};
