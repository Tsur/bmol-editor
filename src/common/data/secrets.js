'use strict';

var argvs = require('minimist')(process.argv.slice(2));

try {

  module.exports = require(argvs['secrets-file'] || process.env.SECRETS_FILE ||
    '~/.kalzate');

} catch (e) {

  module.exports = {};

}