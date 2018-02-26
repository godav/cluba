(function () {

    angular.module('app')
            .controller('clubearsCtrl',
                    function ($scope, currentAuth, userObj, $mdPanel, $state) {
                        $scope._mdPanel = $mdPanel;
                        $scope.openFrom = 'button';
                        $scope.closeTo = 'button';
                        $scope.animationType = 'scale';
                        $scope.duration = 300;
                        $scope.separateDurations = {
                            open: $scope.duration,
                            close: $scope.duration
                        };


                        $scope.currentAuth = currentAuth;
                        $scope.currentUser = userObj;
                        $scope.showMobileMainHeader = true;

                        $scope.goFriends = function () {
                            $state.go('clubears.friends.all');
                        };

                        $scope.showDialog = function () {
                            var position = $scope._mdPanel.newPanelPosition()
                                    .absolute()
                                    .right()
                                    .top();

                            var animation = this._mdPanel.newPanelAnimation();

                            animation.duration(this.duration || this.separateDurations);

                            switch (this.openFrom) {

                                case 'corner':
                                    animation.openFrom({top: 56, left: 0});
                                    break;
                            }
                            ;
                            switch (this.closeTo) {

                                case 'corner':
                                    animation.closeTo({top: 56, left: 0});
                                    break;
                            }
                            ;

                            switch (this.animationType) {
                                case 'custom':
                                    animation.withAnimation({
                                        open: 'demo-dialog-custom-animation-open',
                                        close: 'demo-dialog-custom-animation-close'
                                    });
                                    break;
                                case 'slide':
                                    animation.withAnimation(this._mdPanel.animation.SLIDE);
                                    break;
                            }

                            var config = {
                                animation: animation,
                                attachTo: angular.element(document.body),
                                controller: DialogCtrl,
                                controllerAs: 'ctrl',
                                templateUrl: 'app/templete/panel.tmpl.html',
                                panelClass: 'demo-dialog-example',
                                position: position,
                                trapFocus: true,
                                zIndex: 150,
                                clickOutsideToClose: true,
                                clickEscapeToClose: true,
                                hasBackdrop: true,
                            };

                            this._mdPanel.open(config);
                        };

                    })

            .controller('DialogCtrl', DialogCtrl);


// Necessary to pass locals to the dialog template.
    function DialogCtrl(mdPanelRef) {
        this._mdPanelRef = mdPanelRef;
    }

    DialogCtrl.prototype.closeDialog = function () {
        console.log('swipe');
        this._mdPanelRef && this._mdPanelRef.close();
    };

})();
