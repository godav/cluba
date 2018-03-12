angular.module('app')

        .directive('showDuringResolve', function ($rootScope,$timeout) {

            return {
                restrict: 'E',
//                replace: true,
                template: '<div class="loader-background">' +
                        '<div class="loader"></div>' +
                        +'</div>',
                link: function (scope, element) {
                    console.log(element);
                    element.addClass('ng-hide');

                    $timeout(function () {
                        $rootScope.$on('$stateChangeStart', function () {
                            console.log('start2');
                            element.removeClass('ng-hide');
                        }, 1000);
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
//                replace: true,
                template: '<div class="loader-background">' +
                        '<div class="loader"></div>' +
                        +'</div>',
                link: function (scope, element) {
                    console.log(element);

                    $rootScope.$on('$stateChangeStart', function (evt, toState, toParams, fromState, fromParams) {

                        console.log(fromState);
                        console.log(toState);
                        console.log('exit1-start');
                        if (fromState.name === "")
                        {
                            console.log('start1');
                            $timeout(function () {
                                element.removeClass('ng-hide');
                            });
                        }

                    });

                    $rootScope.$on('$stateChangeSuccess', function (evt, toState, toParams, fromState, fromParams) {
                        console.log('exit1-changed');
                        if (fromState.name === "")
                        {
                            console.log('exit1');
                            element.addClass('ng-hide');
                        }
                    });
                }
            };
        });