
angular.module('app').controller('clubears.friends.sugg.ctrl',
        function ($scope, $state, faceFriends) {


            console.log('in suggestions');
            console.log(faceFriends);
            $scope. friends = faceFriends;


        });
  