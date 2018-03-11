angular.module('app')

        .directive('showDuringResolve', function ($rootScope) {

            return {
                restrict: 'E',
                replace: true,
                template: '<div layout="column" layout-align="center center" layout-sm="column" style="min-height:100%;">' +
                        '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
                        +'</div>',
                link: function (scope, element) {

                    element.addClass('ng-hide');

                    $rootScope.$on('$routeChangeStart', function () {
                        console.log('start2');
                        element.removeClass('ng-hide');
                    });

                    $rootScope.$on('$routeChangeSuccess', function () {
                        console.log('exit2');
                        element.addClass('ng-hide');
                    });
                }
            };
        })

        .directive('resolveLoader', function ($rootScope, $timeout) {

            return {
                restrict: 'E',
                replace: true,
                template: '<div layout="column" layout-align="center center" layout-sm="column" style="min-height:100%;">' +
                        '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
                        +'</div>',
                link: function (scope, element) {

                    $rootScope.$on('$routeChangeStart', function (event, currentRoute, previousRoute) {
                        console.log('start1');
                        console.log(previousRoute);
                        if (previousRoute)
                            return;

                        $timeout(function () {
                            element.removeClass('ng-hide');
                        });
                    });

                    $rootScope.$on('$routeChangeSuccess', function () {
                        console.log('exit1');
                        element.addClass('ng-hide');
                    });
                }
            };
        });