'use strict';

import settings from '../../../../settings/init';

const DatFlagGround = 0;
const DatFlagGroundBorder = 1;
const DatFlagOnBottom = 2;
const DatFlagOnTop = 3;
const DatFlagContainer = 4;
const DatFlagStackable = 5;
const DatFlagForceUse = 6;
const DatFlagMultiUse = 7;
const DatFlagWritable = 8;
const DatFlagWritableOnce = 9;
const DatFlagFluidContainer = 10;
const DatFlagSplash = 11;
const DatFlagNotWalkable = 12;
const DatFlagNotMoveable = 13;
const DatFlagBlockProjectile = 14;
const DatFlagNotPathable = 15;
const DatFlagPickupable = 16;
const DatFlagHangable = 17;
const DatFlagHookSouth = 18;
const DatFlagHookEast = 19;
const DatFlagRotateable = 20;
const DatFlagLight = 21;
const DatFlagDontHide = 22;
const DatFlagTranslucent = 23;
const DatFlagDisplacement = 24;
const DatFlagElevation = 25;
const DatFlagLyingCorpse = 26;
const DatFlagAnimateAlways = 27;
const DatFlagMinimapColor = 28;
const DatFlagLensHelp = 29;
const DatFlagFullGround = 30;
const DatFlagLook = 31;
const DatFlagCloth = 32;
const DatFlagMarket = 33;
const DatFlagUsable = 34;

const DatFlagFloorChange = 252;
const DatFlagNoMoveAnimation = 253; // 10.10: real value is 16, but we need to do this for backwards compatibility
const DatFlagChargeable = 254;
const DatFlagLast = 255;

function loadSpritesMetadata(file){

  this._data = {};

  this.dataFileSignature = file.getUint32(0, true);
	this.itemCount = file.getUint16(4, true);
	this.creatureCount = file.getUint16(6, true);
	this.effectCount = file.getUint16(8, true);
	this.distanceCount = file.getUint16(10, true);

  // .dat file starts with id 100
  const minClientID = 100;
  let id = 100;
  let offset = 12;
  // We don't load distance/effects, if we would, just add effect_count & distance_count here
  const maxclientID = this.itemCount + this.creatureCount;

  this.version = this.clients.getBySignature(this.dataFileSignature);

  while(id <= maxclientID) {

    this._data[id] = {};

    let noffset = loadSpriteMetadataFlags(offset, file, this._data[id]);

    offset = noffset;

    const groupCount = 1;

    for(let k = 0; k < groupCount; ++k) {

      // Size and GameSprite data
			this._data[id]['width'] = file.getUint8(offset, true);

      offset++;

      this._data[id]['height'] = file.getUint8(offset, true);

			offset++;

      // Skipping the exact size
			if((this._data[id]['width'] > 1) || (this._data[id]['height'] > 1)){
				offset++;
			}

      this._data[id]['layers'] = file.getUint8(offset, true); // Number of blendframes (some sprites consist of several merged sprites)

      offset++;

			this._data[id]['pattern_x'] = file.getUint8(offset, true);

      offset++;

			this._data[id]['pattern_y'] = file.getUint8(offset, true);

      offset++;

      this._data[id]['pattern_z'] = file.getUint8(offset, true);

      offset++;

			this._data[id]['frames'] = file.getUint8(offset, true);// Length of animation

      offset++;

      this._data[id]['numsprites'] = this._data[id]['width'] * this._data[id]['height'] * this._data[id]['layers'] * this._data[id]['pattern_x'] * this._data[id]['pattern_y'] * this._data[id]['pattern_z'] * this._data[id]['frames'];

      for(let i = 0; i < this._data[id]['numsprites']; ++i) {

        let sprite_id = file.getUint16(offset, true);

        offset += 2;

				if(!this._data[id]['spriteList']) {

          this._data[id]['spriteList'] = [];
				}

        this._data[id]['spriteList'].push({id:sprite_id});
			}

    }

    ++id;

  }

}

function getUTF8String(dataview, offset, length, endian=true) {
    var utf16 = new ArrayBuffer(length * 2);
    var utf16View = new Uint16Array(utf16);
    for (var i = 0; i < length; ++i) {
        utf16View[i] = dataview.getUint8(offset + i, endian);
    }
    return String.fromCharCode.apply(null, utf16View);
}

function loadSpriteMetadataFlags(offset, file, store){

  let prev_flag = 0;
  let flag = DatFlagLast;

  for(let i = 0; i < DatFlagLast; ++i) {

		prev_flag = flag;

    flag = file.getUint8(offset, true);

    offset += 1;

    if(flag == DatFlagLast) return offset;

    switch (flag) {

			case DatFlagGroundBorder:
			case DatFlagOnBottom:
			case DatFlagOnTop:
			case DatFlagContainer:
			case DatFlagStackable:
			case DatFlagForceUse:
			case DatFlagMultiUse:
			case DatFlagFluidContainer:
			case DatFlagSplash:
			case DatFlagNotWalkable:
			case DatFlagNotMoveable:
			case DatFlagBlockProjectile:
			case DatFlagNotPathable:
			case DatFlagPickupable:
			case DatFlagHangable:
			case DatFlagHookSouth:
			case DatFlagHookEast:
			case DatFlagRotateable:
			case DatFlagDontHide:
			case DatFlagTranslucent:
			case DatFlagLyingCorpse:
			case DatFlagAnimateAlways:
			case DatFlagFullGround:
			case DatFlagLook:
			case DatFlagFloorChange:
			case DatFlagNoMoveAnimation:
			case DatFlagChargeable:
				break;

			case DatFlagGround:
			case DatFlagWritable:
			case DatFlagWritableOnce:
			case DatFlagCloth:
			case DatFlagLensHelp:
			case DatFlagUsable:
				offset += 2;
				break;

			case DatFlagLight:
				offset += 4;
				break;

			case DatFlagDisplacement:

				store['drawoffset_x'] = file.getUint16(offset, true);

        offset += 2;

				store['drawoffset_y'] = file.getUint16(offset, true);

        offset += 2;

				break;

			case DatFlagElevation:

        store['draw_height'] = file.getUint16(offset, true);

        offset += 2;

				break;

			case DatFlagMinimapColor:

        store['minimap_color'] = file.getUint16(offset, true);

        offset += 2;

        break;

			case DatFlagMarket:

        offset += 6;
        const marketName = getUTF8String(file, offset, 16);
        debugger;
				offset += 4;
				break;

			default: break;

		}
  }

  return offset;
}

class SpritesManager {

  constructor(ClientsVersion){

    this.clients = ClientsVersion;

  }

  load(data, cb){

    loadSpritesMetadata.bind(this)(new DataView(data.dat.data));

    cb();

  }

  data(){

    return this._data;
  }

  getVersionInfo(){

    return {dat: this.dataFileSignature, spr: this.sprFileSignature, version: this.version};
  }

  static factory(ClientsVersion){

    return new SpritesManager(ClientsVersion);

  }

}

SpritesManager.factory.$inject = ['ClientsVersion'];

export default SpritesManager;

//
// angular.module('bmol.core')
//   .factory('SpriteManager', ['$http',
//     function($http) {
//
//       var sprBuffer, dataLoaded;
//       var spr = {};
//       var data = {};
//
//       return {
//
//         'loadData': function(fn) {
//
//           $http
//             .get('/api/bmol/data')
//             .success(function(response) {
//               data = response;
//               dataLoaded = true;
//               fn(false);
//             })
//             .error(function() {
//               dataLoaded = false;
//               fn(true);
//             });
//         },
//         'loadSpr': function(data) {
//           sprBuffer = new DataView(data);
//         },
//         'get': function(id, le) {
//
//           le = le || false;
//
//           if (spr[id]) {
//             return spr[id];
//           }
//
//           // var spr_addr = sprBuffer.getUint32(((id - 1) * 4) + 6, le);
//           // var len = sprBuffer.getUint32(spr_addr, le);
//
//
//           // var img_data = new Uint8Array(sprBuffer.buffer.slice(spr_addr + 4, spr_addr + len));
//           // var img_64 = String.fromCharCode.apply(null, img_data);
//
//           var from = sprBuffer.getUint32(((id - 1) * 4) + 6, le);
//           var to = sprBuffer.getUint32(((id) * 4) + 6, le);
//
//           var img_data = new Uint8Array(sprBuffer.buffer.slice(from, to));
//           var img_64 = String.fromCharCode.apply(null, img_data);
//
//           spr[id] = 'data:image/png;base64,' + btoa(img_64);
//
//           return spr[id];
//         },
//         'read': function() {
//           return data;
//         },
//         'dataLoaded': function() {
//           return dataLoaded
//         },
//         'sprLoaded': function() {
//           return !!sprBuffer
//         }
//       };
//
//     }
//   ]);
