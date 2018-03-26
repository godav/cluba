angular.module('app')

        .directive("scrollHeadlineNotifications", function ($document) {
            return function (scope, element, attrs) {
                console.log('inside directive');
                console.log(scope);
                console.log(element);
                  console.log($document);
                  console.log($document[0].getElementById('#notifications-toolbar'));
                  
                var header = $document[0].getElementById('#notifications-toolbar');
                var content = document.querySelector('#notifications-content');
                var last = document.querySelector('.last-notification');
                console.log(header);
                console.log(content);
                console.log(last);
                element.bind('scroll', function () {
                    last = document.querySelector('.last-notification');

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