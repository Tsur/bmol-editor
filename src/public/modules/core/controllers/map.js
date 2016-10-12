/* Controllers */

import YAML from 'yamljs';

class MapCtrl {

  constructor($rootScope, $scope, $state, $timeout, CanvasManager){

    $scope.progress = true;
    $scope.metaX = "";
    $scope.metaY = "";
    $scope.meta = "";

    $rootScope.$on('coords:updated', (event, coords) => {

      $scope.$apply(()=>{

        $scope.canvasX =  coords.x;
        $scope.canvasY = coords.y;

      });

    });

    $scope.canvasX =  0;
    $scope.canvasY = 0;

    $scope.size = {

      'width': 1000,
      'height': 1000
    };


    $scope.saveMap = function(){

      return CanvasManager.serializeMap();

    }

    $scope.loadMap = function(file){

      try{

        const map = JSON.parse(file)

        CanvasManager.deserializeMap(map);

        $rootScope.$broadcast('game:force-paint');

      }
      catch(e){

        console.error(e);

      }

    }

    $scope.grid = function(){
      CanvasManager.gridEnabled = !CanvasManager.gridEnabled;
      $rootScope.$broadcast('game:force-paint');
    }

    $scope.saveMeta = function(){

      try {

        CanvasManager.setMeta($scope.metaX, $scope.metaY, YAML.parse($scope.meta));
      }
      catch(error) {

        console.error(error);
      }

    }

    $scope.fetchMeta = function(){

      try {
        $scope.meta = YAML.stringify(CanvasManager.getMeta($scope.metaX, $scope.metaY));
      }
      catch(error) {

        console.error(error);
      }

    }

    // $timeout(() => {
    //
      $scope.progress = false
    //
    // }, 1000);

  }


}

MapCtrl.$inject = ['$rootScope','$scope', '$state', '$timeout', 'CanvasManager'];

export default MapCtrl;
