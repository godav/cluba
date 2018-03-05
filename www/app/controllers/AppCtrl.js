angular
        .module('app')



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
  