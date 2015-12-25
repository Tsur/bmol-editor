/* Controllers */

/* Controllers */

class SalesCtrl {

  constructor($scope, $state, $window, $timeout, Auth){

      $scope.progress = true;

      $timeout(() => $scope.progress = false, 4000);
  }

}

SalesCtrl.$inject = ['$scope', '$state', '$window', '$timeout', 'Auth'];

export default SalesCtrl;
