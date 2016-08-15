'use strict';

import _ from 'lodash';

export default {

  "1": {
    "description": "Soil Ground",
    "rep": 118,
    "paint": (self, map, x, y) => map.layer[x][y] = _.sample(_.range(118, 127))
  }

};
