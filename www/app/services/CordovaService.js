(function () {


    angular.module('fsCordova', [])
            .service('CordovaService', ['$q', '$rootScope',
                function ($q, $rootScope) {
                    console.log('CordovaService');
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

                    this.ready = d.promise;
                    document.addEventListener('deviceready', function () {
                        resolved = true;
                        document.addEventListener('pause', onPause.bind(this), false);
                        document.addEventListener('resume', onResume.bind(this), false);
                        cordova.plugins.diagnostic.requestLocationAuthorization(function (status) {
                            $rootScope.locationAuth = status;
                            d.resolve(window.cordova);
                        }, function (error) {
                            console.error(error);
                            alert('wierd error when request location auth');
                        });
                    }, false);
                    // Check to make sure we didn't miss the 
                    // event (just in case)
                    setTimeout(function () {
                        if (!resolved) {
                            if (window.cordova) {
                                document.addEventListener('pause', onPause.bind(this), false);
                                document.addEventListener('resume', onResume.bind(this), false);
                                cordova.plugins.diagnostic.requestLocationAuthorization(function (status) {
                                    $rootScope.locationAuth = status;
                                    d.resolve(window.cordova);
                                }, function (error) {
                                    console.error(error);
                                    alert('wierd error when request location auth');
                                });

                            }
                        }
                    }, 3000);
                }]);

})();