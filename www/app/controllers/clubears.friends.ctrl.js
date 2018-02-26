(function () {

    angular.module('app').controller('clubears.friends.ctrl',
            function ($scope, currentAuth) {
                console.log(currentAuth);
                console.log(currentAuth.providerData[0].uid);
                console.log($scope.currentNavItem);
                $scope.currentNavItem = "friends";

                $scope.name = currentAuth.displayName;

                $scope.picture = currentAuth.photoURL;



            });
})();