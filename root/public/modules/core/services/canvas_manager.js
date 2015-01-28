angular.module('bmol.core')
  .factory('CanvasManager', [

    function() {

      return {

        currentSprite: 0,
        dragging: false,
        deleting: false,
        out: false,
        coords: {},
        getCoords: function(i) {
          return {
            x: i % 80,
            y: i / 80
          };
        }
      };

    }
  ]);