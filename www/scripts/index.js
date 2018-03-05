// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
        (function () {
            "use strict";

            window.onload = function () {
                // get injector object
                var initInjector = angular.injector(['fsCordova']);

                // extract necessary angular services
                var CordovaService = initInjector.get('CordovaService');

                // do operations before bootstrap
                // 
                // 

                CordovaService.ready.then(function (cordova) {
                    // Cordova is ready
                    console.log(cordova);
                    navigator.splashscreen.hide();
                }, function (error) {
                    console.log(error);
                });

//                // get user sign in status
//                $http({
//                    url: 'https://api.mysite.com/auth/user/basic',
//                    method: 'GET',
//                    headers: {
//                        'x-auth-token': localStorage.getItem('auth-token')
//                    }
//                })
//                        // when first request resolves
//                        // store user sign in status and other info
//                        // as a constant in `config` module
//                        .then(
//                                // signed in {statusCode : 200} // OK
//                                        function (res) {
//                                            angular.module('config').constant('__user', {
//                                                $state: 'signed',
//                                                $accType: res.data.accountType,
//                                                $accData: res.data
//                                            });
//                                        },
//                                        // not signed in {statusCode : 403} // Forbidden
//                                                function () {
//                                                    angular.module('config').constant('__user', {
//                                                        $state: 'unsigned'
//                                                    });
//                                                }
//                                        )
//                                                // resolves on either success or failed response
//                                                // of previous authentication request 
//                                                .then(function () {
//                                                    // start bootstrapping
//                                                    angular.bootstrap(document, ['myApp']);
//                                                    // add `_splash_fade_out` class to splash screen
//                                                    // when resolved after animation complete, remove element from DOM
//                                                    $animate
//                                                            .addClass(angular.element('splash-screen'), '_splash_fade_out')
//                                                            .then(function () {
//                                                                angular.element('splash-screen').remove();
//                                                            });
//                                                });
                                    };



                        })();