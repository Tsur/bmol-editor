/* Controllers */

class HeaderCtrl{

  constructor($scope, $window) {

    $scope.navCollapsed = false;

    $scope.toTickets = function()
    {
        $window.location.href = '/tickets';//Solucion temporal
    }

    $scope.genID = 1;

    $scope.updateID = function()
    {
        $scope.genID = Math.floor((Math.random()*1000)+1);
        //console.log('here');
    }

  }
}

HeaderCtrl.$inject = ['$scope', '$window'];

export default HeaderCtrl;
