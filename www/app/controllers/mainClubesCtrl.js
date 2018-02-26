
angular.module('app').controller('mainClubesCtrl', 
function ($scope,$state,clubesNearBy) {
    $scope.clubes = clubesNearBy;
        
        console.log( $scope.clubes);
        
        $scope.enterClub = function (clubPressed){

        	 $state.go('clubears.club', {clubId: clubPressed.$id});
        };

});
  