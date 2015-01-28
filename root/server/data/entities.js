//Grounds start from
var GROUNDS = 1;
var BORDERS = 1000;
var ITEMS = 2000;
var CREATURES = 3000;
var EFFECTS = 4000;
var MISSILES = 5000;

data = {};

var register = {

  ground: function(spr, speed, msg) {
    data[GROUNDS] = {

      'spr': spr,
      'speed': speed || 10,
      'msg': msg || ''
    };

    GROUNDS++;
  },

  border: function(spr, speed, msg) {
    data[BORDERS] = {

      'spr': spr,
      'speed': speed || 10,
      'msg': msg || ''
    };

    BORDERS++;
  },

  item: function(spr, attr, msg) {
    data[ITEMS] = {

      'spr': spr,
      'attr': attr,
      'msg': msg || ''
    };

    ITEMS++;
  },

  creature: function(spr, attr, msg) {
    data[CREATURES] = {

      'spr': spr,
      'speed': attr,
      'msg': msg || ''
    };

    CREATURES++;
  },

  effect: function(spr, attr, msg) {
    data[EFFECTS] = {

      'spr': spr,
      'speed': attr,
      'msg': msg || ''
    };

    EFFECTS++;
  },

  missile: function(spr, attr, msg) {
    data[MISSILES] = {

      'spr': spr,
      'speed': attr,
      'msg': msg || ''
    };

    MISSILES++;
  }
}

//Grounds
register.ground([1], 10, 'Grass');
register.ground([112], 15, 'Dark Wood');
register.ground([223], 15, 'Bright Wood');
register.ground([270], 10, 'Stone Ground');
register.ground([281], 15, 'Soil Ground');
register.ground([292], 15, 'Mud Ground');
register.ground([303], 15, 'Black Stone Ground');
register.ground([314], 15, 'White Stone Ground');
register.ground([244, 245, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 258], 15, 'Grass');
register.ground([157, 168, 179, 190, 201, 212, 224, 235, 246], 15, 'Soil');

register.item([337, 338, 340, 339], {
  w: 64,
  h: 64
}, 'Tree')

// {c:[{x:0,y:0},{x:32,y:0},{x:0,y:32},{x:32,y:32}],w:64,h:64}

//Totals
data['groundsTotal'] = GROUNDS - 1;
data['bordersTotal'] = BORDERS - 1000;
data['itemsTotal'] = ITEMS - 2000;
data['creaturesTotal'] = CREATURES - 3000;
data['effectsTotal'] = EFFECTS - 4000;
data['missilesTotal'] = MISSILES - 5000;

module.exports = data;