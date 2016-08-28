'use strict';

import settings from '../../../../settings/init';
import BufferReader from 'buffer-reader';
import PNGImage from 'pngjs-image';
import _ from 'lodash';
import base64 from 'base64-js';

function createPNG(size) {
  const image = PNGImage.createImage(size, size);
  for(let i = 0; i < 32; i++) {
    for(let j = 0; j < 32; j++) {
      // image.setPixel(i, j, {red: 255, green: 0, blue: 255, alpha: 255});
      image.setPixel(i, j, {red: 0, green: 0, blue: 0, alpha: 0});
    }
  }

  return image;
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

class SpritesManager {

  constructor(){

    this._loaded = false;
    this.selectedID = false;

  }

  setID(id){

    this.selectedID = id;
  }

  getID(){

    return this.selectedID;

  }

  spr(id, le) {

    if(!this._loaded) return;

    if (this._spr[id]) return this._spr[id];

    const size = 32;

    const image = createPNG(size);
    const formula = 6 + (id - 1) * 4;

    this._spr_buffer.seek(formula);

    const address = this._spr_buffer.nextUInt32LE();

    if (address == 0) throw new Error('invalid id', id);

    this._spr_buffer.seek(address);

    // Skipping color key.
    this._spr_buffer.move(3);

    const offset = this._spr_buffer.tell() + this._spr_buffer.nextUInt16LE();

    let currentPixel = 0;

    while(this._spr_buffer.tell() < offset) {

      const transparentPixels = this._spr_buffer.nextUInt16LE();
      const coloredPixels = this._spr_buffer.nextUInt16LE();

      currentPixel += transparentPixels;

      for (let i = 0; i < coloredPixels; i++){

        image.setPixel(
          parseInt(currentPixel % size),
          parseInt(currentPixel / size),
          {red:this._spr_buffer.nextUInt8(), green:this._spr_buffer.nextUInt8(), blue:this._spr_buffer.nextUInt8(), alpha:255});

        currentPixel++;
      }
    }


    // const img_64 = String.fromCharCode.apply(null, image.toBlobSync());
    // this._spr[id] = 'data:image/png;base64,' + btoa(img_64);
    const imagBlob = image.toBlobSync();

    this._spr[id] = 'data:image/png;base64,' + base64Slice(imagBlob, 0, imagBlob.byteLength);

    return this._spr[id];

  }

  id(id){

    return this._dat[id];
  }

  getPalette(type){

    //@todo research why do we need to return the img
    //if we return here just Object.keys(settings.tiles[type]); and then
    //from the template.html we call to {{spritemanager.getFromPalette}}
    // every time we click or apply is called this is called too ¿¿??

    const ids = Object.keys(settings.tiles[type]);

    return ids.map(id => ({id, img: this.getFromPalette(type, id), desc: settings.tiles[type][id].description}));

  }

  setTile(palette, id){

    const mapContainerElement = document.querySelector('.ui-map-grid-container');

    if(mapContainerElement) mapContainerElement.classList[palette ? 'add' : 'remove']('cursor-paint');

    if(!palette){
      return this.selectedID = null;
    }

    this.selectedID = palette == "raw" ? id : settings.tiles[palette][id];
    // this.palette = palette;

  }

  // getSelectedPalette(){
  //
  //   return this.palette;
  // }

  getFromPalette(palette, id){

    if(palette == "raw") return this.spr(id);

    const sprID = settings.tiles[palette][id].rep;

    return _.isFunction(sprID) ?
      sprID(settings.tiles[palette][id], this) : this.spr(sprID);
  }

  load(data){

    this._spr_buffer = new BufferReader(new Buffer(data.spr.data));
    // this._dat_buffer = new BufferReader(new Buffer(data.dat.data));
    //
    // this.info = {
    //
    //   sprSignature: this._spr_buffer.nextUInt32LE(),
    //   sprSize: this._spr_buffer.nextUInt16LE(),
    //
    //   datSignature: this._dat_buffer.nextUInt32LE(),
    //   datSize: {
    //
    //   	itemCount: this._dat_buffer.nextUInt16LE(),
    //   	creatureCount: this._dat_buffer.nextUInt16LE(),
    //   	effectCount: this._dat_buffer.nextUInt16LE(),
    //   	distanceCount: this._dat_buffer.nextUInt16LE()
    //   }
    // };
    //
    this._spr = {};
    // this._dat = loadSpritesMetadata(this._dat_buffer, this.info.datSize.itemCount + this.info.datSize.creatureCount);
    this._loaded = true;

  }

  isLoaded(){

    return this._loaded;
  }

  static factory(){

    return new SpritesManager();

  }

}

SpritesManager.factory.$inject = [];

export default SpritesManager;


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

function loadSpritesMetadata(file, toID){

  const data = {};

  // .dat file starts with id 100
  const minClientID = 100;
  // We don't load distance/effects, if we would, just add effect_count & distance_count here
  const maxclientID = toID;

  let id = 100;

  // this.version = this.clients.getBySignature(this.dataFileSignature);

  while(id <= maxclientID) {

    data[id] = loadSpriteMetadataFlags(file);

    const groupCount = 1;

    for(let k = 0; k < groupCount; ++k) {

      // Size and GameSprite data
			data[id]['width'] = file.nextUInt8();
      data[id]['height'] = file.nextUInt8();

      // Skipping the exact size
			if((data[id]['width'] > 1) || (data[id]['height'] > 1)){
        file.move(1);
			}

      data[id]['layers'] = file.nextUInt8(); // Number of blendframes (some sprites consist of several merged sprites)
			data[id]['pattern_x'] = file.nextUInt8();
			data[id]['pattern_y'] = file.nextUInt8();
      data[id]['pattern_z'] = file.nextUInt8();
      data[id]['frames'] = file.nextUInt8();// Length of animation
      data[id]['numsprites'] = data[id]['width'] * data[id]['height'] * data[id]['layers'] * data[id]['pattern_x'] * data[id]['pattern_y'] * data[id]['pattern_z'] * data[id]['frames'];

      for(let i = 0; i < data[id]['numsprites']; ++i) {

        let sprite_id = file.nextUInt16LE();

				if(!data[id]['spriteList']) {

          data[id]['spriteList'] = [];
				}

        data[id]['spriteList'].push({id:sprite_id});
			}

    }

    ++id;

  }

  return data;

}

function loadSpriteMetadataFlags(file){

  let store = {};
  let prev_flag = 0;
  let flag = DatFlagLast;

  for(let i = 0; i < DatFlagLast; ++i) {

		prev_flag = flag;

    flag = file.nextUInt8();

    if(flag == DatFlagLast) return store;

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
				file.move(2);
				break;

			case DatFlagLight:
				file.move(4);
				break;

			case DatFlagDisplacement:

				store['drawoffset_x'] = file.nextUInt16LE();
				store['drawoffset_y'] = file.nextUInt16LE();

				break;

			case DatFlagElevation:

        store['draw_height'] = file.nextUInt16LE();

				break;

			case DatFlagMinimapColor:

        store['minimap_color'] = file.nextUInt16LE();

        break;

			case DatFlagMarket:

        file.move(6);
        const marketName = file.nextString(16);
        dfile.move(4);
				break;

			default: break;

		}
  }

  return store;
}
/*
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
*/
