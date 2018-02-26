(function () {

    angular.module('app')
            .service('$clubToast', function () {
                return {
                    show: function (content, parent,type) {
                        toastr.options = {
                            "closeButton": false,
                            "debug": false,
                            "newestOnTop": false,
                            "progressBar": false,
                            "positionClass": "toast-top-right",
                            "preventDuplicates": true,
                            "onclick": null,
                            "showDuration": "800",
                            "hideDuration": "0",
                            "timeOut": "2000",
                            "extendedTimeOut": "1000",
                            "showEasing": "swing",
                            "hideEasing": "linear",
                            "showMethod": "fadeIn",
                            "hideMethod": "fadeOut",
                            "rtl": true
                        };

                        var newEle = angular.element("<div id='toast-container'></div>");
                        var target = document.getElementById(parent);
                        angular.element(target).append(newEle);

                        toastr[type](content);      // options for type are : warning, success, error

                    }
                };
            });
})(); 