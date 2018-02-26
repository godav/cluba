(function () {

    angular.module('app').controller('mainCtrl',
            function ($scope, currentAuth) {

                $scope.currentNavItem = "clubes";

                $scope.name = currentAuth.displayName;

                $scope.picture = currentAuth.photoURL;
            });
})();