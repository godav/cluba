angular.module('app')

        .directive("scrollHeadlineClubes", function ($window) {
            return function (scope, element, attrs) {
                var header = document.querySelector('#clubes-toolbar');
                var content = document.querySelector('#clubes-content');
                var last = document.querySelector('.club-hr-bottom');

                element.bind('scroll', function () {
                    last = document.querySelector('.club-hr-bottom');

                    var recTool = header.getBoundingClientRect();
                    var recCont = content.getBoundingClientRect();
                    var recLast = last.getBoundingClientRect();


                    if (recCont.bottom >= recLast.top)

                    {

                        scope.clubes.$scroll();
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