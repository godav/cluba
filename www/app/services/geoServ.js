(function () {

    angular.module('app').
            service("GEOLOCATION", function ($cordovaGeolocation, $q, $rootScope) {

                console.log('geolocation init');
                var ClubesRef = firebase.database().ref('geoClubes');


                // Convert Degress to Radians
                function Deg2Rad(deg) {
                    return deg * Math.PI / 180;
                }

                function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
                    var R = 6371; // Radius of the earth in km
                    var dLat = Deg2Rad(lat2 - lat1);  // deg2rad below
                    var dLon = Deg2Rad(lon2 - lon1);
                    var a =
                            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                            Math.cos(Deg2Rad(lat1)) * Math.cos(Deg2Rad(lat2)) *
                            Math.sin(dLon / 2) * Math.sin(dLon / 2)
                            ;
                    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                    var d = R * c; // Distance in km
                    return d;
                }


                function PythagorasEquirectangular(lat1, lon1, lat2, lon2) {
                    lat1 = Deg2Rad(lat1);
                    lat2 = Deg2Rad(lat2);
                    lon1 = Deg2Rad(lon1);
                    lon2 = Deg2Rad(lon2);
                    var R = 6371; // km
                    var x = (lon2 - lon1) * Math.cos((lat1 + lat2) / 2);
                    var y = (lat2 - lat1);
                    var d = Math.sqrt(x * x + y * y) * R;
                    return d;
                }

                function calcDistance(latitude, longitude, clubes) {
                    var arr = [];
                    for (var key in clubes) {
                        if (clubes[key].active) {
                            var distance = PythagorasEquirectangular(latitude, longitude, clubes[key].latitude, clubes[key].longitude);
                            arr.push({id: key, name: clubes[key].name, logo: clubes[key].clubLogo, distance: distance.toFixed(1)});
                        }
                    }
                    return arr.sort(function (a, b) {
                        return a.distance - b.distance;
                    });

                }



                var watchOptions = {
                    timeout: 3000,
                    enableHighAccuracy: false // may cause errors if true
                };

                var watch = null;

                this.watchUserLocation = function () {
                    var userLocation = {
                        position: {},
                        error: {}
                    };

                    var one = $q.defer();

                    watch = $cordovaGeolocation.watchPosition(watchOptions);
                    watch.then(
                            null,
                            function (err) {
                                console.log('error');
                                console.log(err);
                                userLocation.position = null;
                                userLocation.error = err;
                                $rootScope.$broadcast('watcher', userLocation);
                                one.reject();
                            },
                            function (position) {
                                userLocation.position = position;
                                userLocation.error = null;
                                $rootScope.$broadcast('watcher', userLocation);
                                one.resolve();
                            });

                    return one.promise;

                };



                this.GetClubesNearBy = function (lat, long) {
                    var one = $q.defer();
                    ClubesRef.once('value').then(function (snapshot) {
                        var clubes = calcDistance(lat, long, snapshot.val());
                        one.resolve(clubes);
                    });

                    return one.promise;

                };

            });


})(); 