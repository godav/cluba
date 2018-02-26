(function () {

    angular.module('app')
            .controller('AppCtrl', function ($scope) {
                var imagePath = 'img/list/60.jpeg';
                $scope.messages = [{
                        face: imagePath,            
                        who: 'Min Li Chan',
                        when: '3:08PM'               
                    }, {
                        face: imagePath,            
                        who: 'Min Li Chan',
                        when: '3:08PM'  
                    }, {
                        face: imagePath,            
                        who: 'Min Li Chan',
                        when: '3:08PM'  
                    }, {
                        face: imagePath,            
                        who: 'Min Li Chan',
                        when: '3:08PM'  
                    }, {
                        face: imagePath,            
                        who: 'Min Li Chan',
                        when: '3:08PM'  
                    }];
            });

})();