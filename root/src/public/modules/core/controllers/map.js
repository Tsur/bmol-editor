/* Controllers */

/* Controllers */

class MapCtrl {

  constructor($rootScope, $scope, $state, $timeout, CanvasManager){

    $scope.progress = true;

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

    // $timeout(() => {
    //
      $scope.progress = false
    //
    // }, 1000);

  }


}

MapCtrl.$inject = ['$rootScope','$scope', '$state', '$timeout', 'CanvasManager'];

export default MapCtrl;
