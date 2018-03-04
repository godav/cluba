// For an introduction to the Blank template, see the following documentation:
// http://go.microsoft.com/fwlink/?LinkID=397704
// To debug code on page load in cordova-simulate or on Android devices/emulators: launch your app, set breakpoints, 
// and then run "window.location.reload()" in the JavaScript Console.
        (function () {
            "use strict";

            document.addEventListener('deviceready', onDeviceReady.bind(this), false);

            function onDeviceReady() {
                // Handle the Cordova pause and resume events
                document.addEventListener('pause', onPause.bind(this), false);
                document.addEventListener('resume', onResume.bind(this), false);

                // onSuccess Callback
                // This method accepts a Position object, which contains the
                // current GPS coordinates
                //
//                var onSuccess = function (position) {
//                    console.log('Latitude: ' + position.coords.latitude + '\n' +
//                            'Longitude: ' + position.coords.longitude + '\n' +
//                            'Altitude: ' + position.coords.altitude + '\n' +
//                            'Accuracy: ' + position.coords.accuracy + '\n' +
//                            'Altitude Accuracy: ' + position.coords.altitudeAccuracy + '\n' +
//                            'Heading: ' + position.coords.heading + '\n' +
//                            'Speed: ' + position.coords.speed + '\n' +
//                            'Timestamp: ' + position.timestamp + '\n');
//                };
//
//                // onError Callback receives a PositionError object
//                //
//                function onError(error) {
//                    alert('code: ' + error.code + '\n' +
//                            'message: ' + error.message + '\n');
//                }
//
//                navigator.geolocation.getCurrentPosition(onSuccess, onError);;
            }
            ;

            function onPause() {
                // TODO: This application has been suspended. Save application state here.
            }
            ;

            function onResume() {
                // TODO: This application has been reactivated. Restore application state here.
            }
            ;
        })();