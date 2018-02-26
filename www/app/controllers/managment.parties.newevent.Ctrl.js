angular.module('app')
        .controller('managment.parties.newevent.Ctrl', function ($scope, EVENTS, $state, $stateParams, $clubToast) {


            $scope.cancel = function () {
                $scope.$parent.partiesShow = true;
                $state.go('managment.parties', {clubId: $stateParams.clubId, role: $stateParams.role});
                $clubToast.show('האירוע לא נפתח', 'managment-content', 'error');
            };

            $scope.addEvent = function () {
                if ($scope.eventForm.$valid) {
                    var hour = $scope.event.eTime.getHours();
                    var minute = $scope.event.eTime.getMinutes();
                    $scope.event.eDate.setHours(hour);
                    $scope.event.eDate.setMinutes(minute);
                    $scope.event.eDate = $scope.event.eDate.getTime();
                    $scope.event.groups = 0;
                    EVENTS.AddEvent($scope.event, $stateParams.clubId);
                    $scope.$parent.partiesShow = true;
                    $state.go('managment.parties', {clubId: $stateParams.clubId, role: $stateParams.role});
                    $clubToast.show('האירוע נפתח', 'managment-content', 'success');
                }
            };

            $scope.event = {};
            $scope.event.pending = {all: 0, male: 0, female: 0};
            $scope.event.approved = {all: 0, male: 0, female: 0};
            $scope.event.entered = {all: 0, male: 0, female: 0};

            $scope.event.minAge = 18;
            $scope.event.Price = 0;
            $scope.eventDate = new Date();

        });
