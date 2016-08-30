/* Controllers */

/* Controllers */

class SigninCtrl {

  constructor($scope, $state, $window, $timeout, Auth){

    $scope.display_forgot_icon = false;

    $scope.hideForgotIconOnBlur = function () {

        // How long it takes to process the click event ~ 200ms
        $timeout( function () {

            $scope.display_forgot_icon = false;

        }, 200);
    };

    $scope.signin = function() {

        $scope.$parent.error = false;
        //Set loading to false for deactivate the entire loading animation
        $scope.$parent.loading = true;

        Auth.signin({

            email: $scope.username,
            password: $scope.password

        }, user => {

            $scope.$parent.error = false;
            $scope.$parent.loading = false;
            $state.go('index');

        }, error => {

          $timeout(()=>{

            $scope.$parent.loading = false;
            $scope.$parent.error = true;

          }, 100);

        });

     };

    $scope.loginOauth = function (provider) {
        $window.location.href = '/auth/' + provider;
    };
  }

}

SigninCtrl.$inject = ['$scope', '$state', '$window', '$timeout', 'Auth'];

export default SigninCtrl;
