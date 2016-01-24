/* Controllers */

/* Controllers */

class MapCtrl {

  constructor($scope, $state, $timeout){

    $scope.progress = true;

    $scope.size = {

      'width': 1000,
      'height': 1000
    };

    $timeout(() => {

      $scope.progress = false

    }, 1000);

  }


}

MapCtrl.$inject = ['$scope', '$state', '$timeout'];

export default MapCtrl;
