angular.module('app')
        .directive('fbImageUpload', [function () {
                return {
                    link: function (scope, element, attrs) {
                        // Modified from https://developer.mozilla.org/en-US/docs/Web/API/FileReader
                        var fileReader = new FileReader();
                        scope.image = {};
                        fileReader.onload = function (fileReaderEvent) {
                            scope.$apply(function () {
                                scope.image.data = fileReaderEvent.target.result;
                                console.log(scope.image.data);
                            });
                        };

                        var load_image = function (imageInput) {
                            if (imageInput.files.length === 0) {
                                return;
                            }
                            var file = imageInput.files[0];
                            console.log(file);
                            scope.image.filename = file.name;
                            fileReader.readAsDataURL(file);
                            scope.$apply();
                        };

                        element[0].onchange = function () {
                            load_image(element[0]);
                        };


                        function shrink(img) {
                            var ctx = canvas.getContext("2d");
                            ctx.drawImage(img, 0, 0);
                            var MAX_WIDTH = 800;
                            var MAX_HEIGHT = 600;
                            var width = img.width;
                            var height = img.height;

                            if (width > height) {
                                if (width > MAX_WIDTH) {
                                    height *= MAX_WIDTH / width;
                                    width = MAX_WIDTH;
                                }
                            } else {
                                if (height > MAX_HEIGHT) {
                                    width *= MAX_HEIGHT / height;
                                    height = MAX_HEIGHT;
                                }
                            }
                            canvas.width = width;
                            canvas.height = height;
                            var ctx = canvas.getContext("2d");
                            ctx.drawImage(img, 0, 0, width, height);

                            return  canvas.toDataURL("image/png");
                        }


                    },
                    restrict: 'A'
                };
            }]);