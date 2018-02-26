angular.module('app')
        .directive("mainSideNav", function ($mdSidenav) {
            return {
                templateUrl: 'app/templete/mainSideNav.html',
                link: function ($scope, element, attrs) {
                    $scope.openSideNavPanel = function () {
                        $mdSidenav('left').open();
                    };
                    $scope.closeSideNavPanel = function () {
                        $mdSidenav('left').close();
                    };


                }
            };
        });