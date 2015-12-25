'use strict';

import _ from 'lodash';

const mode = process.env.NODE_ENV;
const settings = require(`./${mode}`);

settings.default.get = (field, defaultValue) => {

  return _.get(settings.default, field, defaultValue);

};

settings.default.switch = mode => {

  settings.default = require(`./${mode}`).default;

};

export default settings.default;
