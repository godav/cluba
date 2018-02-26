angular
        .module('app')

        .config(function ($mdThemingProvider, $mdDateLocaleProvider) {
            $mdThemingProvider.theme('altTheme')
                    .primaryPalette('deep-purple')
                    .accentPalette('purple'); // specify primary color, all
            // other color intentions will be inherited
            // from default

   
          
        })

        .controller('AppCtrl', ["$scope", "$interval",
            function ($scope, $interval) {


                var self = this;
                self.activated = true;
                self.determinateValue = 30;
                // Iterate every 100ms, non-stop and increment
                // the Determinate loader.
                $interval(function () {

                    self.determinateValue += 1;
                    if (self.determinateValue > 100) {
                        self.determinateValue = 30;
                    }

                }, 100);
            }

        ]);
  