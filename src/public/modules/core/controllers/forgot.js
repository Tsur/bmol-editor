/* Controllers */

class ForgotCtrl {

  constructor($scope, $http, $state){

    $scope.step1 = function() {

        $scope.$parent.error = false;
        //Set loading to false for deactivate the entire loading animation
        $scope.$parent.loading = true;

        $http
        .post('/api/user/password/forgot', {step: 'request_code', data: $scope.identifier})
        .success(function (response)
        {
            $scope.$parent.error = false;
            $scope.$parent.loading = false;
            $scope.$parent.forgot_identifier = $scope.identifier;
            $state.go('forgot_secure', {}, {location: false});
        })
        .error(function (err){
            $scope.$parent.error = true;
            $scope.$parent.loading = false;
        });

    };

    $scope.step2 = function() {

        $scope.$parent.error = false;
        //Set loading to false for deactivate the entire loading animation
        $scope.$parent.loading = true;

        $http
        .post('/api/user/password/forgot',{step: 'send_password', data: $scope.$parent.forgot_identifier, code: $scope.code})
        .success(function (response)
        {
            $scope.$parent.error = false;
            $scope.$parent.loading = false;
            $scope.$parent.forgot_identifier = undefined;
            $state.go('signin');
        })
        .error(function (err){
            $scope.$parent.error = true;
            $scope.$parent.loading = false;
        });
    };

  }

}

ForgotCtrl.$inject = ['$scope', '$http', '$state'];

export default ForgotCtrl;
