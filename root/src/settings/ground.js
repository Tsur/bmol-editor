'use strict';

import _ from 'lodash';

export default {

  "1": {
    "description": "Soil Ground",
    "rep": 118,
    "paint": (self, spritesManager, x, y) => spritesManager.setInMap(x, y, _.sample(_.range(118, 127)), 'ground')
  },
  "2": {
    "description": "Black Soil Ground",
    "rep": 208,
    "paint": (self, spritesManager, x, y) => spritesManager.setInMap(x, y, 208, 'ground')
  },
  "3": {
    "description": "White Soil Ground",
    "rep": 209,
    "paint": (self, spritesManager, x, y) => spritesManager.setInMap(x, y, 209, 'ground')
  },
  "4": {
    "description": "Down stairs",
    "rep": 30,
    "paint": (self, spritesManager, x, y) => spritesManager.setInMap(x, y, 30, 'ground')
  }

};
