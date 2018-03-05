(function () {


    var cordova = angular.module('fsCordova', [])
            .service('CordovaService', ['$q',
                function ($q) {

                    function onPause() {
                        // TODO: This application has been suspended. Save application state here.
                    }
                    ;
                    function onResume() {
                        // TODO: This application has been reactivated. Restore application state here.
                    }
                    ;
                    var d = $q.defer(),
                            resolved = false;
                    var self = this;
                    this.ready = d.promise;
                    document.addEventListener('deviceready', function () {
                        resolved = true;
                        document.addEventListener('pause', onPause.bind(this), false);
                        document.addEventListener('resume', onResume.bind(this), false);
                        d.resolve(window.cordova);
                    });
                    // Check to make sure we didn't miss the 
                    // event (just in case)
                    setTimeout(function () {
                        if (!resolved) {
                            if (window.cordova) {
                                document.addEventListener('pause', onPause.bind(this), false);
                                document.addEventListener('resume', onResume.bind(this), false);
                                d.resolve(window.cordova);
                            }
                        }
                    }, 3000);
                }])


            .service('geoWatch', ['$q', function ($q) {

                    this.position = null;
                    this.watchUserLocation = function () {

                        var watchOptions = {
                            timeout: 60 * 60 * 1000,
                            maxAge: 0,
                            enableHighAccuracy: true
                        };
                        var one = $q.defer();
                        var onSuccess = function (position) {
                            console.log(position);
                            this.position = position;
                            one.resolve(position);
                        };
                        // onError Callback receives a PositionError object
                        //
                        function onError(error) {
                            console.log(error);
                            this.position = error;
                            console.log('code: ' + error.code + '\n' +
                                    'message: ' + error.message + '\n');
                            one.reject(error);
                        }
                        navigator.geolocation.watchPosition(onSuccess, onError, watchOptions);
                        return one.promise;
                    };
                }]);
    // this is the place for splash screen after everything is loaded
    cordova.run(function (CordovaService, geoWatch) {


//                                return geoWatch.watchUserLocation();
//                        },
//                                afterGeo: function (userLocation, geoWatch) {
//                                console.log(userLocation);
//                                        console.log(geoWatch.position);
//                                        angular.bootstrap(document, ['app']);
//                                }
//                        }
//
//                        });
    });
})();