angular.module('app')

        .directive('showDuringResolve', function ($rootScope) {

            return {
                restrict: 'E',
                replace: true,
                template: '<div layout="column" layout-align="center center" layout-sm="column" style="opacity: 0.5; min-height:100%;">' +
                        '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
                        +'</div>',
                link: function (scope, element) {

                    element.addClass('ng-hide');

                    $rootScope.$on('$stateChangeStart', function () {
                        console.log('start2');
                        element.removeClass('ng-hide');
                    });

                    $rootScope.$on('$stateChangeSuccess', function () {
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
                template: '<div layout="column" layout-align="center center" layout-sm="column" style="opacity: 0.5; min-height:100%;">' +
                        '<md-progress-circular md-mode="indeterminate"></md-progress-circular>' +
                        +'</div>',
                link: function (scope, element) {

                    $rootScope.$on('$stateChangeStart', function (evt, toState, toParams, fromState, fromParams) {
                        console.log('start1');
                        console.log(fromState);
                          console.log(toState);
                        if (fromState)
                            return;

                        $timeout(function () {
                            element.removeClass('ng-hide');
                        });
                    });

                    $rootScope.$on('$stateChangeSuccess', function () {
                        console.log('exit1');
                        element.addClass('ng-hide');
                    });
                }
            };
        });