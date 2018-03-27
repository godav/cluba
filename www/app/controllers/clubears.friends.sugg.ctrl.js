
angular.module('app').controller('clubears.friends.sugg.ctrl',
        function ($scope, $clubToast, faceFriends, FRIENDS, currentAuth) {


            console.log('in suggestions');
            console.log(faceFriends);
            $scope.friends = faceFriends;

            $scope.addFriend = function (friend,index) {
                console.log('press on add');
                FRIENDS.AddFriend(friend, currentAuth.uid);
                $scope.friends = faceFriends.slice(index,1);
                $clubToast.show('הבקשה נשלחה בהצלחה', 'toaster-ancor', 'success');
            };

        });
  