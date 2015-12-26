'use strict';

import settings from '../../../../settings/init';

function loadSpritesMetadata(file){

  this.dataFileSignature = file.getUint32(0, true);
	this.itemCount = file.getUint16(4, true);
	this.creatureCount = file.getUint16(6, true);
	this.effectCount = file.getUint16(8, true);
	this.distanceCount = file.getUint16(10, true);

  // .dat file starts with id 100
  const minClientID = 100;
  // We don't load distance/effects, if we would, just add effect_count & distance_count here
  const maxclientID = this.itemCount + this.creatureCount;

  this.version = this.clients.getBySignature(this.dataFileSignature);

}

class SpritesManager {

  constructor(ClientsVersion){

    this.clients = ClientsVersion;

  }

  load(data, cb){

    loadSpritesMetadata.bind(this)(new DataView(data.dat.data));

    cb();

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
