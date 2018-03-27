
angular.module('app').controller('clubears.friends.all.ctrl',
        function ($scope, $state, friends,FRIENDS) {
            console.log(friends);
            $scope.friends = friends;
            console.log('in all');


        });
  