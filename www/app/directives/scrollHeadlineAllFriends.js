angular.module('app')

        .directive("scrollHeadlineAllFriends", function ($window) {
            return function (scope, element, attrs) {
//                var header = document.querySelector('#pending-toolbar');
                var content = document.querySelector('#all-friends-content');
                var last = document.querySelector('.club-hr-no-bottom');
                console.log('scroll');
                console.log(content);
                console.log(last);
                if (content && last) {
                    var recCont = content.getBoundingClientRect();
                    var recLast = last.getBoundingClientRect();

                    if (recCont.bottom >= recLast.top)
                    {
                        scope.friends.$scroll();
                    }

                    element.bind('scroll', function () {
                        last = document.querySelector('.club-hr-no-bottom');

//                    var recTool = header.getBoundingClientRect();
                        recCont = content.getBoundingClientRect();
                        recLast = last.getBoundingClientRect();

                        if (recCont.bottom <= recLast.top)
                        {
                            scope.friends.$scroll();
                        }



//                    if (recTool.bottom !== recCont.top) {
//                        scope.boolChangeClass = true;
//                    } else {
//                        scope.boolChangeClass = false;
//                    }
                        scope.$apply();
                    });
                }
            };
        });