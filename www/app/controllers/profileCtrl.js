angular.module('app').controller('profileCtrl',
        function ($scope, currentAuth, userObj) {

            $scope.currentAuth = currentAuth;

          console.log(userObj);

            $scope.name = currentAuth.displayName;

            $scope.picture = currentAuth.photoURL;
            $scope.gender = userObj.gender=='male' ? 'בן':'בת';
            $scope.status = "רווק";
          
            $scope.age = "24";


        });