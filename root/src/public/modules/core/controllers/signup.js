/* Controllers */

class SignupCtrl {

  constructor($scope, $state, $timeout, Auth){

    $scope.signup = function() {

        $scope.$parent.error = false;
        $scope.$parent.loading = true;

        Auth.signup({
            fullname: $scope.fullname,
            email: $scope.email
        }, (user, data) => {

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

  }

}

SignupCtrl.$inject = ['$scope', '$state', '$timeout','Auth'];

export default SignupCtrl;
