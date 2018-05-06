
angular.module('app').controller('clubears.club.registration.Ctrl',
        function ($scope, $state, $clubToast, currentClub, userObj, EVENTS, currentEvent, pos, friends) {

            console.log('in ctrl registration');
            console.log(currentEvent);
            console.log(pos);
            console.log(friends);
            $scope.pos = pos;
            $scope.friends = friends;
            $scope.currentPO = null;

            console.log($scope.pos);
            $scope.signIn = function () {
                currentEvent.$save().then(function () {
                    var groupId = currentEvent.groups;
                    console.log('groups', groupId);
                    EVENTS.addUserToEvent(currentEvent.$id, currentClub.$id, userObj, groupId);

                    $clubToast.show('הבקשה לרישום נשלחה', 'toaster-ancor', 'success');
                });
            };

            $scope.cancel = function () {
                $state.go('clubears.club.party');
            };

        });
  