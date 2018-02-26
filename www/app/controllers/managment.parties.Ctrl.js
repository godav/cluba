
angular.module('app').controller('managment.parties.Ctrl',
        function ($scope, currentEvents, $state, $stateParams) {

            $scope.partiesShow = true;
            $scope.role = $stateParams.role;
            $scope.events = currentEvents;

            $scope.back = function () {
                $scope.$parent.show = true;
                $state.go('managment');
            };

            $scope.edit = function (id) {

                $scope.partiesShow = false;
                $state.go('managment.parties.editevent', {clubId: $stateParams.clubId, eventId: id, role: $stateParams.role});
            };

            $scope.pending = function (id) {

                $scope.partiesShow = false;
                $state.go('managment.parties.pending', {clubId: $stateParams.clubId, eventId: id, role: $stateParams.role});
            };

            $scope.approved = function (id) {

                $scope.partiesShow = false;
                $state.go('managment.parties.approved', {clubId: $stateParams.clubId, eventId: id, role: $stateParams.role});
            };

            $scope.newEvent = function () {
                $scope.partiesShow = false;
                $state.go('managment.parties.newevent', {clubId: $stateParams.clubId, role: $stateParams.role});
            };

            $scope.goProfile = function () {
                $state.go('managment.profile', {clubId: $stateParams.clubId, role: $stateParams.role});
            };

            $scope.goPermissions = function () {
                $state.go('managment.permmisions', {clubId: $stateParams.clubId, role: $stateParams.role});
            };

            
        });
  