'use strict';

/*
 FLAGS:

 "over": "if should be render over the player",
 "transparent": "if actions should flow to the previous item",
 "walkable": "if user can be placed on it",
 "moveable": "if it can be moved",
 "wearable": "if it can be weared",

*/
export default {

  "30": {
    "flags": "00100",
    "description": "down stairs",
    "hover": function(action, meta){

        action.movePlayer(meta.x, meta.y);
    }
  },
  "118": {
    "flags": "00100",
    "description": "soil"
  },
  "119": {
    "flags": "00100",
    "description": "soil"
  },
  "120": {
    "flags": "00100",
    "description": "soil"
  },
  "121": {
    "flags": "00100",
    "description": "soil"
  },
  "122": {
    "flags": "00100",
    "description": "soil"
  },
  "123": {
    "flags": "00100",
    "description": "soil"
  },
  "124": {
    "flags": "00100",
    "description": "soil"
  },
  "125": {
    "flags": "00100",
    "description": "soil"
  },
  "126": {
    "flags": "00100",
    "description": "soil"
  },
  "200": {
    "flags": "00111",
    "description": "backpack"
  },
  "201": {
    "flags": "00010",
    "description": "drawer"
  },
  "208": {
    "flags": "00100",
    "description": "black soil"
  },
  "209": {
    "flags": "00100",
    "description": "white soil"
  },
  "1137": {
    "flags": "11100",
    "description": "tree"
  },
  "1138": {
    "flags": "11100",
    "description": "tree"
  },
  "1139": {
    "flags": "00000",
    "description": "tree"
  },
  "1140": {
    "flags": "00000",
    "description": "tree"
  }
};
