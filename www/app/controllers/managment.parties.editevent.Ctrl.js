angular.module('app')
        .controller('managment.parties.editevent.Ctrl', function ($scope, currentEvent, $state, $stateParams, $clubToast) {
            console.log('currentEvent in ctrl');
            console.log(currentEvent);


            $scope.cancel = function () {
                $scope.$parent.partiesShow = true;
                $state.go('managment.parties', {clubId: $stateParams.clubId, role: $stateParams.role});
                $clubToast.show('האירוע לא עודכן', 'managment-content', 'error');
            };

            $scope.updateEvent = function () {
                if (!$scope.eventForm.$pristine && $scope.eventForm.$valid) {
                    var hour = $scope.event.eTime.getHours();
                    var minute = $scope.event.eTime.getMinutes();
                    $scope.event.eDate.setHours(hour);
                    $scope.event.eDate.setMinutes(minute);
                    $scope.event.eDate = $scope.event.eDate.getTime();
                    $scope.event.$save();
                    $scope.$parent.partiesShow = true;
                    $state.go('managment.parties', {clubId: $stateParams.clubId, role: $stateParams.role});
                    $clubToast.show('האירוע עודכן', 'managment-content', 'success');
                } else {
                    $scope.$parent.partiesShow = true;
                    $state.go('managment.parties', {clubId: $stateParams.clubId, role: $stateParams.role});
                    $clubToast.show('האירוע לא עודכן', 'managment-content', 'error');
                }
            };

            $scope.event = {};
            $scope.event = currentEvent;

            $scope.event.eDate = new Date(currentEvent.eDate);
            $scope.event.eTime = new Date(currentEvent.eDate);

        });
