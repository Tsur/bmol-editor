'use strict';

var argvs = require('minimist')(process.argv.slice(2));
var secretPath = argvs['secrets-file'] || process.env.GS_SECRETS_FILE || '/etc/conf.d/bmol.js';

module.exports = require('fs').existsSync(secretPath) ? require(secretPath) : {};