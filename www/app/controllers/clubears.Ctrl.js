(function () {

    angular.module('app')
            .controller('clubears.Ctrl',
                    function ($scope, currentAuth, userObj, $mdDialog, $state, notifications, $rootScope, noteCount, USERS, $timeout) {


                        window.FirebasePlugin.onNotificationOpen(function (notification) {
                            console.log(notification);
                            if (!notification.tap)
                            {
                                USERS.countUserNotification(currentAuth.uid).then(function (count) {
                                    console.log('resolved count : ', count);
                                    // put sound notification for user


                                    $scope.noteCount = count;

                                });
                            }
                        }, function (error) {
                            console.error(error);
                            alert(error);
                        });

                        console.log('$scope.noteCount:', noteCount);
                        $scope.notifications = notifications;
                        $scope.noteCount = noteCount;
                        $scope.currentUser = userObj;
                        $scope.currentAuth = currentAuth;

                        $scope.goFriends = function () {
                            console.log('pressed on friends');
                            $state.go('clubears.friends.all');
                        };


                        $scope.showDialog = function ($event, notifications) {
                            // Appending dialog to document.body to cover sidenav in docs app
                            console.log("showDialog", notifications);
                            var confirm = {
                                controller: NotoficationsCtrl,
                                templateUrl: 'app/templete/notifications.tmpl.html',
                                parent: angular.element(document.body),
                                scope: $scope,
                                clickOutsideToClose: true,
                                fullscreen: true,
                                locals: {
                                    Notifications: notifications
                                },
                                targetEvent: $event

                            };
                            $rootScope.noteModal = true;
                            // here is were the Modal of notification opens
                            $mdDialog.show(confirm).then(function () {
                                // this code runs when the dialog closed
                                console.log('modal closed');
                                confirm = undefined;
                                $rootScope.noteModal = false;
                                USERS.countUserNotification(currentAuth.uid).then(function (count) {
                                    console.log('update on close : ', count);

                                    $scope.noteCount = count;
                                    // anything you want can go here and will safely be run on the next digest.

                                });
                            });
                        };

                        function NotoficationsCtrl($scope, $mdDialog, Notifications, FRIENDS, USERS) {
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

                    });


})();
