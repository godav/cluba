// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
        (function () {
            "use strict";
// https://medium.com/@thatisuday/manual-bootstrapping-angular-application-resolve-dependencies-before-angular-run-block-f572310bcb65

            window.onload = function () {
                // get injector object
                var initInjector = angular.injector(['fsCordova', 'ngCordova']);

                // extract necessary angular services
                var CordovaService = initInjector.get('CordovaService');
                var geoWatch = initInjector.get('geoWatch');
                // do operations before bootstrap
                // 
                // 

                CordovaService.ready.then(function (cordova) {
                    // Cordova is ready

                    geoWatch.startWatchLocation().then(function () {
                        console.log('location');
                        console.log(geoWatch.userLocation);
                        angular.bootstrap(document, ['app']);
                        navigator.splashscreen.hide();
                    }, function () {
                        console.log('error loc');
                    });




                }, function (error) {
                    // fatal error the cordova native is not ready need to put error message to user
                    console.log(error);
                });
            };



        })();