angular
        .module('app')
        .controller('managment.Ctrl', function ($scope, $state, userObj, clubesAssign, userClubesRoll) {
            console.log(userClubesRoll);
            $scope.clubes = clubesAssign;
            $scope.roles = userClubesRoll;
            $scope.show = true;
            $scope.currentUser = userObj;
            $scope.checkRole = function (club) {

                if (userClubesRoll[club.$id].role > 2 && !club.active)
                    return true;

            };

            $scope.editClub = function (club) {
                $scope.show = false;
                if (!club.active)
                    $state.go('managment.profile', {clubId: club.$id, role: userClubesRoll[club.$id].role});
                else
                    $state.go('managment.parties', {clubId: club.$id, role: userClubesRoll[club.$id].role});

            };

            $scope.back = function () {
                $state.go('clubears.main.clubes');
            };


        });


