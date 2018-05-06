(function () {

    angular.module('app').
            service("ROLES", function (Auth, $q) {
                if (Auth) {
                    var rolesRef = firebase.database().ref('roles');
                    var posRef = firebase.database().ref('clubPO');

                    this.getClubesUserAssign = function (userId) {
                        var one = $q.defer();

                        rolesRef.child(userId).once('value').then(function (snapshot) {
                            var clubes = {};
                            snapshot.forEach(function (childSnapshot) {
                                if (childSnapshot.val().active) {
                                    clubes[childSnapshot.key] = {"role": childSnapshot.val().role};
                                }
                            });
                            $q.all(clubes).then(function (values) {
                                one.resolve(values);
                            });
                        });
                        return one.promise;
                    };

                    this.getAllMangersOfClub = function (clubId) {
                        var one = $q.defer();

                        posRef.child(clubId).once('value').then(function (snapshot) {
                            var pos = {};
                            console.log("snapshot",snapshot);
                             console.log("snapshot",snapshot.val());
                             var clubes = {};
//                            snapshot.POS.forEach(function (childSnapshot) {
//                                if (childSnapshot.val().active) {
//                                    clubes[childSnapshot.key] = {"role": childSnapshot.val().role};
//                                }
//                            });
//                            snapshot.managers.forEach(function (childSnapshot) {
//                                if (childSnapshot.val().active) {
//                                    clubes[childSnapshot.key] = {"role": childSnapshot.val().role};
//                                }
//                            });
                            $q.all(clubes).then(function (values) {
                                one.resolve(values);
                            });
                        });
                        return one.promise;
                    };
                }
            });
})(); 