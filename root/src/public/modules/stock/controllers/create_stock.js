/* Controllers */

/* Controllers */

class CreateStockCtrl {

  constructor($scope, $state, $window, $timeout, Auth){

      $scope.progress = true;

      $timeout(() => $scope.progress = false, 4000);
  }

}

CreateStockCtrl.$inject = ['$scope', '$state', '$window', '$timeout', 'Auth'];

export default CreateStockCtrl;
