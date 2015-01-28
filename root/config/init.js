'use strict';

// Load environment variables from .env file at root project folder
require('dotenv').load();

/**
 * Read config settings
 * @TODO live settings and cli/env overrides
 * @tutorial configuration_library
 */
exports = module.exports = require('config');