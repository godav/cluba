angular.module('app').controller('profileUpdate', function($scope, $location) {
	
	console.log('in');
  $scope.profile = {
    status: '',
    rate: 500,
    special: true
  };
  
$scope.go = function ( path ) {
	console.log('go');
  $location.path( path );
};


});