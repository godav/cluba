
angular.module('app').controller('clubears.friends.sugg.ctrl',
        function ($scope, $state, faceFriends,FRIENDS,currentAuth) {


            console.log('in suggestions');
            console.log(faceFriends);
            $scope. friends = faceFriends;
            
            $scope.addFriend = function(friend){
                console.log('press on add');
                FRIENDS.AddFriend(friend,currentAuth.uid);
            };

        });
  