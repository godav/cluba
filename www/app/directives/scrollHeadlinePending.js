angular.module('app')

        .directive("scrollHeadlinePending", function ($window) {
            return function (scope, element, attrs) {
                var header = document.querySelector('#pending-toolbar');
                var content = document.querySelector('#pending-content');
                var last = document.querySelector('.club-hr-no-bottom');

                var recCont = content.getBoundingClientRect();
                var recLast = last.getBoundingClientRect();

                if (recCont.bottom >= recLast.top)
                {
                    scope.users.$scroll();
                }

                element.bind('scroll', function () {
                    last = document.querySelector('.club-hr-no-bottom');

                    var recTool = header.getBoundingClientRect();
                    recCont = content.getBoundingClientRect();
                    recLast = last.getBoundingClientRect();

                    if (recCont.bottom <= recLast.top)
                    {
                        scope.users.$scroll();
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