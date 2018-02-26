
angular.module('app').controller('mainHistoryCtrl', 
function ($scope) {
    $scope.history = [{id: 1, name: "אולטראסאונד", distance: 14.5, photo: "img/pb.png"},
        {id: 2, name: "חורבה", distance: 7.4, photo: "img/pb.png"},
        {id: 3, name: "לונה", distance: 2.5, photo: "img/pb.png"},
        {id: 4, name: "הספרייה", distance: 9.3, photo: "img/pb.png"}];

});
  