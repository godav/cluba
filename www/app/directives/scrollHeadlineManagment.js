angular.module('app')

        .directive("scrollHeadlineManagment", function ($window) {
            return function (scope, element, attrs) {
                var header = document.querySelector('#managment-toolbar');
                var content = document.querySelector('#managment-content');
                var last = document.querySelector('.club-hr-no-bottom');

                element.bind('scroll', function () {
                    last = document.querySelector('.club-hr-no-bottom');

                    var recTool = header.getBoundingClientRect();
                    var recCont = content.getBoundingClientRect();
                    var recLast = last.getBoundingClientRect();

                    if (recCont.bottom >= recLast.top)
                    {
                        scope.events.$scroll();
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