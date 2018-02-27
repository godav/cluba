angular.module('app')
        .directive('backImg', function () {
            return function (scope, element, attrs) {
                var url = attrs.backImg ? attrs.backImg : 'img/empty-logo.png';
                element.css({
                    'background': 'url(' + url + ') no-repeat center center fixed',
                    'background-size': 'contain'
                });
            };
        }); 