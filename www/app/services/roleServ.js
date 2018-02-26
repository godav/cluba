(function () {

    angular.module('app').
            service("ROLES", function (Auth, $q) {
                if (Auth) {
                    var rolesRef = firebase.database().ref('roles');

                    this.getClubesUserAssign = function (userId) {
                        var one = $q.defer();

                        rolesRef.child(userId).once('value').then(function (snapshot) {
                            var clubes = {};                
                            snapshot.forEach(function (childSnapshot) {
                                if (childSnapshot.val().active){
                                    clubes[childSnapshot.key]= { "role": childSnapshot.val().role};
                                    }
                            });
                            $q.all(clubes).then(function (values) {                         
                                one.resolve(values);
                            });
                        });
                        return one.promise;
                    };
                }
            });
})(); 