/* Controllers */

/* Controllers */

class StockCtrl {

  constructor($scope, $state, $window, $timeout, Auth){

      $scope.progress = true;

      $timeout(() => $scope.progress = false, 4000);
  }

}

StockCtrl.$inject = ['$scope', '$state', '$window', '$timeout', 'Auth'];

export default StockCtrl;
