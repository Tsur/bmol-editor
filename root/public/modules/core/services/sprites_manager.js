angular.module('bmol.core')
  .factory('SpriteManager', ['$http',
    function($http) {

      var sprBuffer, dataLoaded;
      var spr = {};
      var data = {};

      return {

        'loadData': function(fn) {

          $http
            .get('/api/bmol/data')
            .success(function(response) {
              data = response;
              dataLoaded = true;
              fn(false);
            })
            .error(function() {
              dataLoaded = false;
              fn(true);
            });
        },
        'loadSpr': function(data) {
          sprBuffer = new DataView(data);
        },
        'get': function(id, le) {

          le = le || false;

          if (spr[id]) {
            return spr[id];
          }

          // var spr_addr = sprBuffer.getUint32(((id - 1) * 4) + 6, le);
          // var len = sprBuffer.getUint32(spr_addr, le);


          // var img_data = new Uint8Array(sprBuffer.buffer.slice(spr_addr + 4, spr_addr + len));
          // var img_64 = String.fromCharCode.apply(null, img_data);

          var from = sprBuffer.getUint32(((id - 1) * 4) + 6, le);
          var to = sprBuffer.getUint32(((id) * 4) + 6, le);

          var img_data = new Uint8Array(sprBuffer.buffer.slice(from, to));
          var img_64 = String.fromCharCode.apply(null, img_data);

          spr[id] = 'data:image/png;base64,' + btoa(img_64);

          return spr[id];
        },
        'read': function() {
          return data;
        },
        'dataLoaded': function() {
          return dataLoaded
        },
        'sprLoaded': function() {
          return !!sprBuffer
        }
      };

    }
  ]);