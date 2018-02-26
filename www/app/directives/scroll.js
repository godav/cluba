angular.module('app')
        .directive("scroll", function ($window) {

            return function (scope, element, attrs) {

                /* header DOM element with md-page-header attribute */
                var header = document.querySelector('[md-page-header]');

                /* Store header dimensions to initialize header styling */
                var baseDimensions = header.getBoundingClientRect();
                
                var content = document.querySelector('#profile-content');
                
                var first = true;
                /* DOM element with md-header-picture attribute (picture in header) */
                var picture = angular.element(document.querySelector('[md-header-picture]'));
              
                /* DOM element with main-fab class (a DOM element which contains the main float action button element) */
                var fab = angular.element(document.querySelector('.main-fab'));
                /* The height of a toolbar by default in Angular Material */
                var legacyToolbarH = angular.element(document.querySelector('md-toolbar').clientHeight)[0];
                /* The mid-height of a float action button by default in Angular Material */
                var legacyFabMid = 56 / 2;


                function handleStyle(dim) {
                    fab.css('top', (dim.height - legacyFabMid) + 'px');
                    if ((dim.bottom - baseDimensions.top) > legacyToolbarH) {
                        element.css('height', (dim.bottom - baseDimensions.top) + 'px');
                    } else {
                        element.css('height', legacyToolbarH + 'px');
                        content.css('top', (dim.bottom) + 'px');
                    }
                    
                    

                    if ((dim.bottom - baseDimensions.top) < legacyToolbarH * 2 && !fab.hasClass('hide')) {
                        fab.addClass('hide');
                    }

                    if ((dim.bottom - baseDimensions.top) > legacyToolbarH * 2 && fab.hasClass('hide')) {
                        fab.removeClass('hide');
                    }

                   
                    //picture.css('-webkit-filter','blur(5px)');
                    picture.css('background-position', '50% ' + (ratio(dim) * 50) + '%');
                    var op = 1.0 - ratio(dim);
                    element.css('background', 'linear-gradient(90deg, rgba(68,120,203,' + op + ') 0%, rgba(68,120,203,' + op + ') 27%, rgba(131,42,210,' + op + ') 63%, rgba(131,42,210,' + op + ') 100%)');

                    /* Uncomment the line below if you want shadow inside picture (low performance) */
                    //element.css('box-shadow', '0 -'+(dim.height*3/4)+'px '+(dim.height/2)+'px -'+(dim.height/2)+'px rgba(0,0,0,'+ratio(dim)+') inset');
                }

                function ratio(dim) {
                    var r = (dim.bottom - baseDimensions.top) / dim.height;
                    if (r < 0)
                        return 0;
                    if (r > 1)
                        return 1;
                    return Number(r.toString().match(/^\d+(?:\.\d{0,2})?/));
                }


                handleStyle(baseDimensions);

                /* Scroll event listener */
                angular.element($window).bind("scroll", function () {
                    if (first) {
                        baseDimensions = header.getBoundingClientRect();
                        first = false;
                    }
                    var dimensions = header.getBoundingClientRect();
                    handleStyle(dimensions);
                    scope.$apply();
                });

                /* Resize event listener */
                angular.element($window).bind('resize', function () {
                    baseDimensions = header.getBoundingClientRect();
                    var dimensions = header.getBoundingClientRect();
                    handleStyle(dimensions);
                    scope.$apply();
                });

            };

        });