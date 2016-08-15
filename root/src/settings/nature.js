'use strict';

import {joinImages} from '../common/lib/canvas';

export default {

  "1": {
    "description": "Tree",
    "rep": (self, spritesManager) => {

      // @todo
      console.log('this got called many times!!');
      return joinImages([1137, 1138, 1139, 1140], spritesManager);


    },
    "paint": (self, map, x, y) => {

      map.layer[x-1][y] = 1139;
      map.layer[x][y] = 1140;
      map.layer[x-1][y-1] = 1137;
      map.layer[x][y-1] = 1138;

    }
  }
};
