(function () {

    angular.module('app')
            .controller('clubears.Ctrl',
                    function ($scope, currentAuth, userObj, $mdDialog, $state, notifications, $rootScope, noteCount, USERS) {


                        window.FirebasePlugin.onNotificationOpen(function (notification) {
                            console.log(notification);
                            if (!notification.tap)
                            {
                                USERS.countUserNotification(currentAuth.uid).then(function (count) {
                                    console.log('resolved count : ', count);
                                    navigator.vibrate(1500);
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
//                        $scope.showMobileMainHeader = true;


//                        $scope.openModal = openModal;
//                        $scope.closeModal = closeModal;

                        $scope.goFriends = function () {
                            $state.go('clubears.friends.all');
                        };


                        $scope.showDialog = function (ev, notifications) {
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
                                    Notifications: notifications,
                                    NoteCount: $scope.noteCount
                                },
                                targetEvent: ev

                            };

                            // here is were the Modal of notification opens
                            $mdDialog.show(confirm).then(function () {
                                $rootScope.noteModal = true;

                            });


                        };

                        function NotoficationsCtrl($scope, $mdDialog, Notifications, FRIENDS, USERS, $timeout, NoteCount) {
                            $scope.Notifications = Notifications;
                            $scope.noteCount = NoteCount;
                            console.log("inside controller for modal:", Notifications);
                            console.log(Notifications);
                            $scope.hide = function () {
                                $mdDialog.hide();
                                $rootScope.noteModal = false;
                                USERS.countUserNotification(currentAuth.uid).then(function (count) {
                                    console.log('update on close : ', count);
                                    $timeout(function () {
                                        $scope.noteCount = count;
                                        // anything you want can go here and will safely be run on the next digest.
                                    });



                                });

                            };

                            $scope.confirm = function (note) {
                                console.log('inside confirm check auth:');
                                console.log(currentAuth);
                                FRIENDS.ConfirmFriend(note.UserRequestId, note.UserRequestName, currentAuth);
//                                var myEl = angular.element(document.querySelector('#notifications-item'));
//                                myEl.addClass('removed-item-animation');
                                USERS.removeUserNotification(note.$id, currentAuth.uid);

                            };

                            $scope.reject = function (note) {
                                FRIENDS.RejectFriend(note.UserRequestId, currentAuth.uid);
//                                var myEl = angular.element(document.querySelector('#notifications-item'));
//                                myEl.addClass('removed-item-animation');
                                USERS.removeUserNotification(note.$id, currentAuth.uid);

                            };

//                            $scope.cancel = function () {
//                                $mdDialog.cancel();
//                                
//                            };
                        }

                    });






// Necessary to pass locals to the dialog template.
//    function DialogCtrl(mdPanelRef) {
//        this._mdPanelRef = mdPanelRef;
//    }
//
//    DialogCtrl.prototype.closeDialog = function () {
//        console.log('swipe');
//        this._mdPanelRef && this._mdPanelRef.close();
//    };

})();
