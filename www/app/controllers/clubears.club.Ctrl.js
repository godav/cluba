angular
        .module('app')


        .controller('clubears.club.Ctrl', function ($state, $scope, clubesEvents, currentClub) {
              $scope.currentNavItem = "parties";
            $scope.currentClub = currentClub;
            console.log(currentClub);
            $state.go('clubears.club.party');

        });
  