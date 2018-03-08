(function () {

    var config = {
        "apiKey": "AIzaSyAUoM0RYqF1-wHI_kYV_8LKgIwxmBEweZ8",
        "authDomain": "clubears-156821.firebaseapp.com",
        "databaseURL": "https://clubears-156821.firebaseio.com",
        "projectId": "clubears-156821",
        "storageBucket": "clubears-156821.appspot.com",
        "messagingSenderId": "970903539685"
    };
    firebase.initializeApp(config);

    var club = angular.module("app", [
        "fsCordova",
        'ngMaterial',
        'ui.router',
        'wu.masonry',
        'ngMessages',
        "firebase",
        "mdPickers",
        "vsGoogleAutocomplete",
        "imageupload",
        "nvd3",
        "nvd3ChartDirectives",
        "ngIntlTelInput",
        'ngCordova'

    ]);

    club.factory("Auth", ["$firebaseAuth",
        function ($firebaseAuth) {
            return $firebaseAuth();
        }
    ]);



    club.config(function (ngIntlTelInputProvider) {

        console.log('in config 1');
        ngIntlTelInputProvider.set(
                {
                    utilsScript: 'js/utils.js'
                });
    })
            .config(function ($mdThemingProvider, $mdDateLocaleProvider) {
                console.log('in config 2');
                $mdThemingProvider.theme('altTheme')
                        .primaryPalette('deep-purple')
                        .accentPalette('purple'); // specify primary color, all
                // other color intentions will be inherited
                // from default



            });



    // UI.ROUTER STUFF
    club.run(function ($rootScope, $state, GEOLOCATION) {
        console.log('in config run');
        $rootScope.userLocation = null;
        $rootScope.clubesNearBy = null;
        $rootScope.$on('watcher', function (event, obj) {
            console.log('in route scope');
            if (!obj.error && !$rootScope.userLocation || obj.position.coords.latitude !== $rootScope.userLocation.position.coords.latitude ||
                    obj.position.coords.longitude !== $rootScope.userLocation.position.coords.longitude) {
                console.alert('their is a change');
                $rootScope.userLocation = obj;
                $rootScope.clubesNearBy = GEOLOCATION.GetClubesNearBy(obj.position.coords.latitude, obj.position.coords.longitude);
            } else if (obj.error)
                console.alert('their is an error in location mdoe');
                // maybe the best thing to do is to take the middle of the country and search from their
                // didn't do it yet.
            else
                console.log('their is no change');
        });



        $rootScope.$on('$stateChangeStart', function (evt, toState, toParams, fromState, fromParams) {
            console.log("$stateChangeStart " + fromState.name + JSON.stringify(fromParams) + " -> " + toState.name + JSON.stringify(toParams));
            $rootScope.spinnerActive = true;
        });
        $rootScope.$on('$stateChangeSuccess', function (evt, toState, toParams, fromState, fromParams) {
            console.log("$stateChangeSuccess " + fromState.name + JSON.stringify(fromParams) + " -> " + toState.name + JSON.stringify(toParams));
            if ((fromState.name === "" && toState.name === "managment") || (fromState.name === "managment.parties" && toState.name === "managment") || (fromState.name === "managment.profile" && toState.name === "managment"))
                $state.reload();
            $rootScope.spinnerActive = false;
        });
        $rootScope.$on('$stateChangeError', function (evt, toState, toParams, fromState, fromParams, error) {
            console.log("$stateChangeError " + fromState.name + JSON.stringify(fromParams) + " -> " + toState.name + JSON.stringify(toParams));
            $rootScope.spinnerActive = false;

            if (angular.isObject(error) && angular.isString(error.code)) {
                console.log(error.code);
                switch (error.code) {
                    case 'AUTH_REQUIRED':
                        // go to the login page
                        console.log('auth');
                        $state.go('login');
                        break;
                    case 'MANAGMENT':
                        $state.go('managment');
                        break;
                    default:
                        // set the error object on the error state and go there
                        $state.get('error').error = error;
                        $state.go('error');
                }
            } else {
                // unexpected error
                console.log('in else');
                console.log(error);
                $state.go('login');
            }


        });

    });

//
//    club.factory('facebookService', function ($q) {
//        return {
//            getMyLastName: function (id, at) {
//                var deferred = $q.defer();
//                console.log('in fact');
//
//                FB.api('/' + id, {
//                    fields: 'last_name',
//                    access_token: at
//                }, function (response) {
//                    console.log(response);
//                    if (!response || response.error) {
//                        deferred.reject('Error occured');
//                    } else {
//                        deferred.resolve(response);
//                    }
//                });
//                return deferred.promise;
//            }
//        };
//    });


})();



