
angular.module('app').controller('clubears.club.party.Ctrl',
        function ($scope, $state, $mdDialog, $clubToast, currentClub, clubesEvents, userObj, EVENTS, checkSigned) {
            $scope.clubEvents = clubesEvents;
            console.log('in ctrl');
            console.log(checkSigned);
            $scope.userRegisterd = checkSigned;

            $scope.showConfirm = function (eventId, ev) {
                // Appending dialog to document.body to cover sidenav in docs app
                if ($scope.userRegisterd[eventId])
                {
                    $mdDialog.show(
                            $mdDialog.alert()
                            .clickOutsideToClose(true)
                            .title('רישום למסיבה')
                            .textContent('כבר ביצעת רישום למסיבה')
                            .ok('אישור')
                            // You can specify either sting with query selector
                            .openFrom('#left')
                            // or an element
                            .closeTo(angular.element(document.querySelector('#right')))
                            );
                } else
                {
                    var index = $scope.clubEvents.$indexFor(eventId);
                    
                       var confirm = {
                                controller: PartyRegisterCtrl,
                                templateUrl: 'app/templete/partyregister.tmpl.html',
                                parent: angular.element(document.body),
//                                scope: $scope,
                                clickOutsideToClose: true,
                                fullscreen: false,
                                locals: {
                              
                                },
                                targetEvent: ev

                            };
                    
                    
                    var confirm = $mdDialog.confirm()
                            .title('היי, בחרת להרשם למסיבה, יש אישור?')
                            .targetEvent(ev)
                            .ok('!כן תרשמו אותי')
                            .cancel('אחשוב על זה');

                    $mdDialog.show(confirm).then(function () {
                        $scope.status = 'ok.';
                        $scope.clubEvents[index].groups++;
                        $scope.clubEvents.$save(index).then(function (ref) {
                            var groupId = $scope.clubEvents[index].groups;
                            EVENTS.addUserToEvent(eventId, currentClub.$id, userObj, groupId);
                            $scope.userRegisterd[eventId] = true;
                            $clubToast.show('הבקשה לרישום נשלחה', 'toaster-ancor', 'success');
                        });

                    }, function () {
                        $scope.status = 'no.';
                        $clubToast.show('בקשה לרישום בוטלה', 'toaster-ancor', 'error');
                    });
                }


            };


                        $scope.showDialog = function (ev, notifications) {
                            // Appending dialog to document.body to cover sidenav in docs app
                            console.log("showDialog", notifications);
                            var confirm = {
                                controller: PartyRegisterCtrl,
                                templateUrl: 'app/templete/partyregister.tmpl.html',
                                parent: angular.element(document.body),
//                                scope: $scope,
                                clickOutsideToClose: true,
                                fullscreen: true,
                                locals: {
                                    Notifications: notifications
                                },
                                targetEvent: ev

                            };
                            $rootScope.noteModal = true;
                            // here is were the Modal of notification opens
                            $mdDialog.show(confirm).then(function () {
                                // this code runs when the dialog closed
                                console.log('modal closed');
                                confirm = undefined;
                                $rootScope.noteModal = false;
                            });
                        };

                        function PartyRegisterCtrl($scope, $mdDialog, Notifications, FRIENDS, USERS) {
                            $scope.Notifications = Notifications;

                            console.log("inside controller for modal:", Notifications);
                            console.log(Notifications);

                            $scope.hide = function () {
                                $mdDialog.hide();
                            };

                            $scope.confirm = function (note) {
                                console.log('inside confirm check auth:');
                                console.log(currentAuth);
                                FRIENDS.ConfirmFriend(note.UserRequestId, note.UserRequestName, currentAuth);
                                USERS.removeUserNotification(note.$id, currentAuth.uid);

                            };

                            $scope.reject = function (note) {
                                FRIENDS.RejectFriend(note.UserRequestId, currentAuth.uid);
                                USERS.removeUserNotification(note.$id, currentAuth.uid);

                            };

                        }

//
//            function DialogController($scope, $mdDialog) {
//                $scope.hide = function () {
//                    $mdDialog.hide();
//                };
//
//                $scope.cancel = function () {
//                    $mdDialog.cancel();
//                };
//
//                $scope.answer = function (answer) {
//                    $mdDialog.hide(answer);
//                };
//            }
        });
  