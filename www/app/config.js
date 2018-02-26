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
        "ngIntlTelInput"
    ]);

    club.factory("Auth", ["$firebaseAuth",
        function ($firebaseAuth) {
            return $firebaseAuth();
        }
    ]);

    club.config(function (ngIntlTelInputProvider) {
        ngIntlTelInputProvider.set(
                {
                    utilsScript: 'js/utils.js'
                });
    });


    // UI.ROUTER STUFF
    club.run(["$rootScope", "$state", function ($rootScope, $state) {

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

        }]);


    club.factory('facebookService', function ($q) {
        return {
            getMyLastName: function (id, at) {
                var deferred = $q.defer();
                console.log('in fact');

                FB.api('/' + id, {
                    fields: 'last_name',
                    access_token: at
                }, function (response) {
                    console.log(response);
                    if (!response || response.error) {
                        deferred.reject('Error occured');
                    } else {
                        deferred.resolve(response);
                    }
                });
                return deferred.promise;
            }
        };
    });


})();



