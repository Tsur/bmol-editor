/* Controllers */

/* Controllers */

class MapCtrl {

  constructor($scope, $state, $timeout){

    $scope.progress = true;

    $scope.size = {

      'width': 2560,
      'height': 2560
    };
    
    $timeout(() => {

      $scope.progress = false

    }, 1000);

  }


}

MapCtrl.$inject = ['$scope', '$state', '$timeout'];

export default MapCtrl;
