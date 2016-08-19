'use strict';

import _ from 'lodash';

export default {

  "1": {
    "description": "Soil Ground",
    "rep": 118,
    "paint": (self, spritesManager, x, y) => spritesManager.setInMap(x, y, _.sample(_.range(118, 127)), 'ground')
  }

};
