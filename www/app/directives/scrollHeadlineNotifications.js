angular.module('app')

        .directive("scrollHeadlineNotifications", function ($window) {
            return function (scope, element, attrs) {
                var header = document.querySelector('#notifications-toolbar');
                var content = document.querySelector('#notifications-content');
                var last = document.querySelector('.club-hr-no-bottom');

                element.bind('scroll', function () {
                    last = document.querySelector('.club-hr-no-bottom');

                    var recTool = header.getBoundingClientRect();
                    var recCont = content.getBoundingClientRect();
                    var recLast = last.getBoundingClientRect();

                    if (recCont.bottom >= recLast.top)
                    {
                        scope.notifications.$scroll();
                    }

                    if (recTool.bottom !== recCont.top) {
                        scope.boolChangeClass = true;
                    } else {
                        scope.boolChangeClass = false;
                    }
                    scope.$apply();
                });
            };
        });