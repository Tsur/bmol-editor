/* Controllers */

class FooterCtrl{

  constructor($http, $scope, $location, Auth, $modal){

    $scope.user = Auth.user;
    //$scope.userRoles = Auth.userRoles;
    //$scope.accessLevels = Auth.accessLevels;
    $scope.shutdown = function() {

        $http
        .post('/api/manage/shutdown')
        .success(function (response)
        {
            //console.log('Apagando');
            delete localStorage.sessTickets;
            delete localStorage.boxes;
            $location.path('/login');
        })
        .error(function (err){

            //console.log('error al apagar')
        });
    };

    $scope.logout = function() {
        Auth.logout(function() {

            delete localStorage.sessTickets;
            delete localStorage.boxes;

            $location.path('/login');
        }, function() {
        });
    };

    $scope.openEdit = function(){
      
        var modalInstance = $modal.open({

          templateUrl: 'ModalEditUser.html',
          controller: 'ModalEditUserCtrl',
          backdrop: 'static',
          keyboard: false

        });

        modalInstance.result.then(function (data) {

            if(data.username)
            {
                Auth.setUserName(data);
            }
        });
    };
  }
}

FooterCtrl.$inject = ['$http', '$scope', '$location', 'Auth', '$modal'];

export default FooterCtrl;
