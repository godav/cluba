
angular.module('app').controller('clubears.friends.sugg.ctrl',
        function ($scope, $clubToast, faceFriends, FRIENDS, currentAuth) {


            console.log('in suggestions');
            console.log(faceFriends);
            $scope.friends = faceFriends;

            $scope.addFriend = function (friend, index) {
                console.log('press on add');
                FRIENDS.AddFriend(friend, currentAuth);
                console.log(friend);
                console.log(currentAuth);
                console.log(index);
                $scope.friends.splice(index, 1);
                console.log($scope.friends);
                $clubToast.show('הבקשה נשלחה בהצלחה', 'toaster-ancor', 'success');
            };

        });
  