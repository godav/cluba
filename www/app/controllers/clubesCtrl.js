angular
        .module('app')


        .controller('clubesCtrl', function ($state, $scope, clubesEvents, currentClub) {
              $scope.currentNavItem = "parties";
            $scope.currentClub = currentClub;
            console.log(currentClub);
            $state.go('clubears.club.party');

        });
  