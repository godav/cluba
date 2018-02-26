angular.module('app')
        .directive('chooseFile', function () {
            return {
                link: function (scope, elem, attrs) {
                    var button = elem.find('button');
                    var input = angular.element(elem[0].querySelector('input#fileInput'));
                    button.bind('click', function () {
                        input[0].click();
                    });
                    input.bind('change', function (e) {
                        scope.$apply(function () {
                            var files = e.target.files;
                            console.log(files);
                            if (files[0]) {
                                scope.fileName = files[0].name;
                                console.log(scope.fileName);
                            } else {
                                scope.fileName = null;
                            }
                        });
                    });
                }
            };
        });