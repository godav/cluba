
angular.module('app').controller('clubears.club.party.Ctrl',
        function ($scope, $state, $mdDialog, clubesEvents, checkSigned) {
            $scope.clubEvents = clubesEvents;
            console.log('in ctrl');
            console.log(checkSigned);
            $scope.userRegisterd = checkSigned;

            $scope.showConfirm = function (eventId, ev) {
                // Appending dialog to document.body to cover sidenav in docs app
                if ($scope.userRegisterd[eventId])
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('רישום למסיבה')
                            .textContent('כבר ביצעת רישום למסיבה')
                            .ok('אישור')
                            // You can specify either sting with query selector
                            .openFrom('#left')
                            // or an element
                            .closeTo(angular.element(document.querySelector('#right')))
                            );
                } else
                {
                    var index = $scope.clubEvents.$indexFor(eventId);
                    console.log(index);
                    console.log(eventId);
                    console.log('move to router');
                    $state.go('clubears.club.registration', {eventId: eventId});

                }


            };

        });
  