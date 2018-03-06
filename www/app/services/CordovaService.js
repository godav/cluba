(function () {


    angular.module('fsCordova', ['ng', 'ngCordova'])
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
                    }, false);
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


            .service('geoWatch', function ($cordovaGeolocation, $q) {
                var self = this;
                self.userLocation = {position: {},
                    error: {}};
                console.log('in services');
                console.log(self.userLocation);

                var watchOptions = {
                    timeout: 3000,
                    enableHighAccuracy: false // may cause errors if true
                };

                self.startWatchLocation = function () {
                    console.log('in function');
                    console.log(self.userLocation);
                    var one = $q.defer();

                    self.watch = $cordovaGeolocation.watchPosition(watchOptions);
                    self.watch.then(
                            null,
                            function (err) {
                                self.userLocation.position = null;
                                self.userLocation.error = err;
                                console.log(err);
                                one.reject();
                            },
                            function (position) {
                                console.log('success');
                                console.log(position);
                                self.userLocation.position = position;
                                self.userLocation.error = null;
                                one.resolve();
                            });

                    return one.promise;

                };

            });

})();