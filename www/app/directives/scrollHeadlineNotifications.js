angular.module('app')

        .directive("scrollHeadlineNotifications", function ($document) {
            return function (scope, element, attrs) {
                angular.element(document).ready(function () {
                    console.log('inside directive');

                    var header = document.querySelector('#notifications-toolbar');
                    var content = document.querySelector('#notifications-content');
                    var last = document.querySelector('.last-notification');
                    console.log(header);
                    console.log(content);
                    console.log(last);

                    element.bind('scroll', function () {
                        last = document.querySelector('.last-notification');

                        var recTool = header.getBoundingClientRect();
                        console.log(recTool);
                        var recCont = content.getBoundingClientRect();
                        var recLast = last.getBoundingClientRect();

                        if (recCont.bottom >= recLast.top)
                        {
                            scope.Notifications.$scroll();
                        }

                        if (recTool.bottom !== recCont.top) {
                            scope.boolChangeClass = true;
                        } else {
                            scope.boolChangeClass = false;
                        }
                        scope.$apply();
                    });


                });


            };
        });