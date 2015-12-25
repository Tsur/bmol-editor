'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import common from './express/common';
import auth from './auth/init';

const app = express();

// Load common default express settings
common(app);

// Load specific environ express settings
// dev(app);

// Load common default express settings
auth();


export default app;
