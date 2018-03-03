(function () {

    angular.module('app').controller('clubears.main.Ctrl',
            function ($scope, currentAuth) {

                $scope.currentNavItem = "clubes";

                $scope.name = currentAuth.displayName;

                $scope.picture = currentAuth.providerData[0].photoURL;
            });
})();