'use strict';

import {joinImages} from '../common/lib/canvas';

export default {

  "1": {
    "description": "Tree",
    "rep": (self, spritesManager) => {

      return joinImages([1137, 1138, 1139, 1140], spritesManager);

    },
    "paint": (self, spritesManager, x, y) => {

      spritesManager.setInMap(x-1, y, 1139);
      spritesManager.setInMap(x, y, 1140);
      spritesManager.setInMap(x-1, y-1, 1137);
      spritesManager.setInMap(x, y-1, 1138);

    }
  }
};
