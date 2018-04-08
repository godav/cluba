(function () {

    angular.module('app')
            .controller('clubears.Ctrl',
                    function ($scope, currentAuth, userObj, $mdDialog, $state, notifications, ModalService, noteCount, USERS) {
//                        $scope._mdPanel = $mdPanel;
//                        $scope.openFrom = 'button';
//                        $scope.closeTo = 'button';
//                        $scope.animationType = 'scale';
//                        $scope.duration = 300;
//                        $scope.separateDurations = {
//                            open: $scope.duration,
//                            close: $scope.duration
//                        };



                        window.FirebasePlugin.onNotificationOpen(function (notification) {
                            console.log(notification);
                            if (!notification.tap)
                            {
                                USERS.countUserNotification(currentAuth.uid).then(function (count) {
                                    console.log('resolved count : ', count);
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
                        $scope.showMobileMainHeader = true;


                        $scope.openModal = openModal;
                        $scope.closeModal = closeModal;

                        $scope.goFriends = function () {
                            $state.go('clubears.friends.all');
                        };

//                        $scope.showDialog = function () {
//                            var position = $scope._mdPanel.newPanelPosition()
//                                    .absolute()
//                                    .right()
//                                    .top();
//
//                            var animation = this._mdPanel.newPanelAnimation();
//
//                            animation.duration(this.duration || this.separateDurations);
//
//                            switch (this.openFrom) {
//
//                                case 'corner':
//                                    animation.openFrom({top: 56, left: 0});
//                                    break;
//                            }
//                            ;
//                            switch (this.closeTo) {
//
//                                case 'corner':
//                                    animation.closeTo({top: 56, left: 0});
//                                    break;
//                            }
//                            ;
//
//                            switch (this.animationType) {
//                                case 'custom':
//                                    animation.withAnimation({
//                                        open: 'demo-dialog-custom-animation-open',
//                                        close: 'demo-dialog-custom-animation-close'
//                                    });
//                                    break;
//                                case 'slide':
//                                    animation.withAnimation(this._mdPanel.animation.SLIDE);
//                                    break;
//                            }
//
//                            var config = {
//                                animation: animation,
//                                attachTo: angular.element(document.body),
//                                controller: DialogCtrl,
//                                controllerAs: 'ctrl',
//                                templateUrl: 'app/templete/panel.tmpl.html',
//                                panelClass: 'demo-dialog-example',
//                                position: position,
//                                trapFocus: true,
//                                zIndex: 150,
//                                clickOutsideToClose: true,
//                                clickEscapeToClose: true,
//                                hasBackdrop: true
//                            };
//
//                            this._mdPanel.open(config);
//                        };

                        function openModal(id) {
                            ModalService.Open(id);
                        }

                        function closeModal(id) {

                            ModalService.Close(id);
                            USERS.countUserNotification(currentAuth.uid).then(function (count) {
                                $timeout(function () {
                                    console.log('resolved count : ', count);
                                    $scope.noteCount = count;
                                });


                            });
                        }

                        $scope.showDialog = function (ev, notifications) {
                            // Appending dialog to document.body to cover sidenav in docs app
                            console.log("showDialog", notifications);
                            var confirm = {
                                controller: NotoficationsCtrl,
                                templateUrl: 'app/templete/notifications.tmpl.html',
                                parent: angular.element(document.body),
                                clickOutsideToClose: true,
                                fullscreen: true,
                                locals: {
                                    Notifications: notifications
                                },
                                targetEvent: ev

                            };

                            $mdDialog.show(confirm).then(function () {
                       
                                console.log("Confirm resolved");
                            });


                        };

                        function NotoficationsCtrl($scope, $mdDialog, Notifications, FRIENDS, USERS, $timeout) {
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

                            $scope.cancel = function () {
                                $mdDialog.cancel();
                            };
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
