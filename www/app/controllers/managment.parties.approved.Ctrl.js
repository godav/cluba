angular.module('app')

        .directive('focusMe', ['$timeout', '$parse', function ($timeout, $parse) {
                return {
                    //scope: true,   // optionally create a child scope
                    link: function (scope, element, attrs) {
                        var model = $parse(attrs.focusMe);
                        scope.$watch(model, function (value) {
                            console.log('value=', value);
                            if (value === true) {
                                $timeout(function () {
                                    element[0].focus();
                                });
                            }
                        });
                        // to address @blesh's comment, set attribute value to 'false'
                        // on blur event:
//                        element.bind('blur', function () {
//                            console.log('blur');
//                            scope.$apply(model.assign(scope, false));
//                        });
                    }
                };
            }])

        .controller('managment.parties.approved.Ctrl', function ($scope, usersInEvent, $state, $stateParams, $clubToast, $mdDialog, EVENTS, ModalService, $timeout) {

//https://codepen.io/AskYous/pen/WwZZgM

            console.log(usersInEvent);
            $scope.users = usersInEvent;
            $scope.isOpen = false;
            $scope.all = false;
            $scope.updated = false;
            $scope.isFilterOpen = false;
            $scope.countt = 0;
            $scope.graph = {};
            $scope.currentEvent = EVENTS.GetOneEvent($stateParams.clubId, $stateParams.eventId);
            $scope.openModal = openModal;
            $scope.closeModal = closeModal;
            $scope.noData = false;

            $scope.search = null;
            $scope.showPreSearchBar = function () {
                return $scope.search === null;
            };

            $scope.initiateSearch = function () {

                $scope.search = '';
            };

            $scope.showSearchBar = function () {

                return $scope.search !== null;
            };

            $scope.endSearch = function () {

                return $scope.search = null;
            };

            $scope.submit = function () {
                console.error('Search function not yet implemented');
            };

            $scope.$watch('search', function (nVal, oVal) {
                if (nVal !== oVal && nVal.length > 0) {
                    EVENTS.SearchUsersByName($stateParams.clubId, $stateParams.eventId, nVal).then(function (data) {
                        $scope.users = data;
                        if ($scope.users.length === 0)
                            $scope.noData = true;
                        else
                            $scope.noData = false;
                    });
                } else if (nVal !== oVal && nVal.length === 0) {

                    EVENTS.GetUsersInEventByName($stateParams.clubId, $stateParams.eventId).then(function (data) {
                        $scope.noData = false;
                        $scope.users = data;
                    });
                }

            });


            $scope.config = {

                refreshDataOnly: true, // default: true
                deepWatchOptions: true, // default: true
                deepWatchData: false // default: true
//                deepWatchDataDepth: 3 // default: 2
//                debounce: 3000 // default: 10
            };


            $scope.options = {
                chart: {
                    type: 'pieChart',
                    height: 250,

                    x: function (d) {
                        return d.label;
                    },
                    y: function (d) {
                        return d.value;
                    },
                    showValues: true, //Display pie labels
                    legendPosition: 'bottom',
                    useInteractiveGuideline: true,
                    labelType: 'percent', //Configure what type of data to show in the label. Can be "key", "value" or "percent"
                    showLabels: true,
                    duration: 500,
                    labelThreshold: 0.01,
                    labelSunbeamLayout: false,
                    title: true,
                    margin: {
                        top: 5,
                        right: 5,
                        bottom: 5,
                        left: 5
                    },
                    noData: null,
                    showLegend: true,
                    defaultState: null,
                    labelsOutside: false,
                    legend: {
                        vers: "classic"
                    }
                },
                title: {
                    enable: true,
                    text: "יחס כניסות נשים גברים",
                    className: "h4",
                    css: {
                        width: "nullpx",
                        textAlign: "center"
                    }
                },

                caption: {
                    enable: true,
                    html: "",
                    css: {
                        width: "nullpx",
                        textAlign: "center",
                        direction: "rtl"

                    }
                }

            };
            function openModal(id) {
                ModalService.Open(id);
            }

            function closeModal(id) {
                ModalService.Close(id);
            }


            $scope.back = function () {

                $scope.$parent.partiesShow = true;
                $state.go('managment.parties', {clubId: $stateParams.clubId, role: $stateParams.role});

            };


            $scope.changeState = function (user)
            {

                if (user.entered)
                    $scope.updated = true;
                else
                    $scope.updated = false;
                $scope.users.$save(user);
            };

            $scope.chart = function ()
            {

                $scope.options.caption.html = "<hr><p>" + $scope.currentEvent.entered.male + " גברים נכנסו מתוך " + $scope.currentEvent.approved.male + " שאושרו " + "</p>" +
                        "<p>" + $scope.currentEvent.entered.female + " נשים נכנסו מתוך " + $scope.currentEvent.approved.female + " שאושרו " + "</p><hr>" +
                        "<p>" + "סך הכל  " + $scope.currentEvent.entered.all + " בליינים נכנסו מתוך " + $scope.currentEvent.approved.all + " שאושרו " + "</p>";

                $scope.data = [
                    {
                        label: "נשים",
                        value: $scope.currentEvent.entered.female,
                        color: "#ff4d6a"
                    },
                    {
                        label: "גברים",
                        value: $scope.currentEvent.entered.male,
                        color: "#4d94ff"
                    }
                ];

                $scope.openModal('pending-gender-graphs');
            };

            $scope.$watchCollection('currentEvent', function (newVal, oldVal) {
                if (newVal.entered.female !== oldVal.entered.female || newVal.entered.male !== oldVal.entered.male) {
                    $scope.options.caption.html = "<hr><p>" + $scope.currentEvent.entered.male + " גברים נכנסו מתוך " + $scope.currentEvent.approved.male + " שאושרו " + "</p>" +
                            "<p>" + $scope.currentEvent.entered.female + " נשים נכנסו מתוך " + $scope.currentEvent.approved.female + " שאושרו " + "</p><hr>" +
                            "<p>" + "סך הכל  " + $scope.currentEvent.entered.all + " בליינים נכנסו מתוך " + $scope.currentEvent.approved.all + " שאושרו " + "</p>";

                    $scope.data = [                        
                        {
                            label: "נשים",
                            value: newVal.entered.female,
                            color: "#ff4d6a"
                        },
                        {
                            label: "גברים",
                            value: newVal.entered.male,
                            color: "#4d94ff"
                        }
                    ];
                }


            });

            $scope.filterAll = function ()
            {

                EVENTS.GetUsersInEventByName($stateParams.clubId, $stateParams.eventId).then(function (data) {
                    $scope.users = data;
                });
            };

            $scope.showConfirm = function (ev, user) {
                // Appending dialog to document.body to cover sidenav in docs app
                var confirm = $mdDialog.confirm({
                    controller: AvatarCtrl,
                    templateUrl: 'app/templete/avatar.tmpl.html',
                    parent: angular.element(document.body),
                    locals: {
                        User: user
                    },
                    targetEvent: ev
                });
                $mdDialog.show(confirm).then(function () {
                    $scope.status = 'Confirm resolved';
                    $scope.codeRunningBeforeResolve = 'code only runs after resolve';
                });
                $scope.codeRunningBeforeResolve = 'code is running before resolve!';
            };
        });

function AvatarCtrl($scope, $mdDialog, User) {
    $scope.User = User;
    console.log(User);
    $scope.hide = function () {
        $mdDialog.hide();
    };
    $scope.cancel = function () {
        $mdDialog.cancel();
    };
}
