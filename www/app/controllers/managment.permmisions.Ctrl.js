angular
        .module('app')

        .config(['$mdIconProvider', function ($mdIconProvider) {
                $mdIconProvider.icon('md-close', 'img/ic_close_black_24px.svg', 24);
            }])

        .controller('managment.permmisions.Ctrl', function (currentAuth, $scope, $clubToast, $state, $stateParams, currentClub, $q, clubPOS, ClubManagers) {

            console.log(currentAuth);
            var root = firebase.database().ref();
//            var clubRef = root.child('clubes');
            var rolesRef = root.child('roles');
            var UsersRef = root.child('users');
            var clubPORef = root.child('clubPO');      // new node for saving the relation between club and po in club
//            var rolesRef = firebase.database().ref('roles');
            $scope.club = currentClub;
            $scope.selectedPO = null;
            $scope.selectedManager = null;
            $scope.searchText = null;

            $scope.selectedManagers = ClubManagers;
            $scope.selectedPOS = clubPOS;

            var po_removed = [];                // use to disable po the dis granted permmision to a club
            var po_added = [];                // use to add new po to granted permmision to a club
            var manager_removed = [];                // use to disable manager the dis granted permmision to a club
            var manager_added = [];                // use to add new manager to granted permmision to a club            
            var po_updated = false;             // used to check if po permision updated

            $scope.checkCurrentManager = function (manager) {
                if (manager.key === currentAuth.uid)
                    return true;
                else
                    return false;
            };


            // this function handle the PO permission adding and removing from chip
            $scope.updatePermmisions = function () {
                if (po_updated) {


                    po_added.forEach(function (item) {
                        var userRef = rolesRef.child(item.key);
                        var newClubRole = userRef.child($scope.club.$id);
                        //check what permision user have in club, if not assign PO permision
                        newClubRole.once("value", function (snapshot) {

                            if (snapshot.val() === null || snapshot.val().active === false)
                            {
                                clubPORef.child($scope.club.$id).child("POS").child(item.key).update({
                                    active: true,
                                    name: item.name
                                });

                                newClubRole.update({
                                    role: 3,
                                    active: true
                                });
                            }
                        });
                        //check what permision user have, if not assign PO permision
                        var usersRef = UsersRef.child(item.key).child('role');
                        usersRef.once("value", function (snapshot) {

                            if (snapshot.val() === null)
                                usersRef.update({"role": 3});
                        });
                    });


                    po_removed.forEach(function (item) {
                        console.log(item);
                        var userRef = rolesRef.child(item.key);
                        var newClubRole = userRef.child($scope.club.$id);
                        //check what permision user have in club, if not assign PO permision
                        newClubRole.once("value", function (snapshot) {

                            if (snapshot.val().active === true && snapshot.val().role === 3)
                                newClubRole.update({
                                    role: 3,
                                    active: false
                                });
                        });

                        clubPORef.child($scope.club.$id).child("POS").child(item.key).once("value", function (snapshot) {

                            if (snapshot.val().active)
                                clubPORef.child($scope.club.$id).child("POS").child(item.key).update({
                                    active: false
                                });
                        });

                        // still need to take care in user role in the users node ( Avner remember to deal with it).
                    });

                    manager_added.forEach(function (item) {
                        var userRef = rolesRef.child(item.key);
                        var newClubRole = userRef.child($scope.club.$id);
                        //check what permision user have in club, if not assign PO permision
                        newClubRole.once("value", function (snapshot) {

                            if (snapshot.val() === null || snapshot.val().active === false)
                            {
                                clubPORef.child($scope.club.$id).child("managers").child(item.key).update({
                                    active: true,
                                    name: item.name
                                });

                                newClubRole.update({
                                    role: 2,
                                    active: true
                                });
                            }
                        });
                        //check what permision user have, if not assign PO permision
                        var usersRef = UsersRef.child(item.key).child('role');
                        usersRef.once("value", function (snapshot) {

                            if (snapshot.val() === null)
                                usersRef.update({"role": 2});
                        });
                    });


                    manager_removed.forEach(function (item) {

                        var userRef = rolesRef.child(item.key);
                        var newClubRole = userRef.child($scope.club.$id);
                        //check what permision user have in club, if not assign PO permision
                        newClubRole.once("value", function (snapshot) {

                            if (snapshot.val().active === true && snapshot.val().role === 2)
                                newClubRole.update({
                                    role: 2,
                                    active: false
                                });
                        });

                        clubPORef.child($scope.club.$id).child("managers").child(item.key).once("value", function (snapshot) {

                            if (snapshot.val().active)
                                clubPORef.child($scope.club.$id).child("managers").child(item.key).update({
                                    active: false
                                });
                        });

                        // still need to take care in user role in the users node ( Avner remember to deal with it).
                    });


                    $clubToast.show('הרשאות עודכנו', 'managers-permmisions', 'success');
                }
            };


            $scope.$watchCollection('selectedPOS', function (newVal, oldVal) {
                // A chip has been removed if oldVal is greater in size than newVal
                if (angular.isArray(oldVal) && oldVal.length > newVal.length) {
                    // Find the item(s) in oldVal that does
                    // not exist anymore in newVal.
                    var diff = oldVal.filter(function (a) {
                        return newVal.filter(function (b) {
                            return a === b;
                        }).length === 0;
                    });

                    if (diff.length === 1) {
                        po_removed.push(diff[0]);
                        po_updated = true;
                    }
                } else if (angular.isArray(oldVal) && oldVal.length < newVal.length) {
                    // Find the item(s) in oldVal that does
                    // not exist anymore in newVal.
                    var diff = newVal.filter(function (a) {
                        return oldVal.filter(function (b) {
                            return a === b;
                        }).length === 0;
                    });

                    if (diff.length === 1) {
                        po_added.push(diff[0]);
                        po_updated = true;
                    }
                }

            });

            $scope.$watchCollection('selectedManagers', function (newVal, oldVal) {
                // A chip has been removed if oldVal is greater in size than newVal
                if (angular.isArray(oldVal) && oldVal.length > newVal.length) {
                    // Find the item(s) in oldVal that does
                    // not exist anymore in newVal.
                    var diff = oldVal.filter(function (a) {
                        return newVal.filter(function (b) {
                            return a === b;
                        }).length === 0;
                    });

                    if (diff.length === 1) {
                        manager_removed.push(diff[0]);
                        po_updated = true;
                    }
                } else if (angular.isArray(oldVal) && oldVal.length < newVal.length) {
                    // Find the item(s) in oldVal that does
                    // not exist anymore in newVal.
                    var diff = newVal.filter(function (a) {
                        return oldVal.filter(function (b) {
                            return a === b;
                        }).length === 0;
                    });

                    if (diff.length === 1) {
                        manager_added.push(diff[0]);
                        po_updated = true;
                    }
                }

            });

            $scope.goParties = function () {
                if (po_updated)
                    alert('שים לב');
                $state.go('managment.parties', {clubId: $stateParams.clubId, role: $stateParams.role});
            };

            $scope.goPermissions = function () {
                $state.go('managment.permmisions', {clubId: $stateParams.clubId, role: $stateParams.role});
            };

            $scope.goProfile = function () {
                $state.go('managment.profile', {clubId: $stateParams.clubId, role: $stateParams.role});
            };

            function getPOS(searchText) {
                var one = $q.defer();
                var users = [];
                UsersRef
                        .orderByChild('phone')
                        .startAt(searchText)
                        .endAt(searchText + "\uf8ff")
                        .once('value', function (snapshot) {
                            snapshot.forEach(function (childSnapshot) {
                                rolesRef.child(childSnapshot.key).child(currentClub.$id).once("value", function (snapshot) {

                                    if (snapshot.val() === null || snapshot.val().active === false)
                                        users.push({"key": childSnapshot.key, "name": childSnapshot.val().first_name + " " + childSnapshot.val().last_name});
                                    one.resolve(users);
                                });
                            });
                        });
                return one.promise;
            }

            $scope.updateUsers = function (searchText) {
                var results = searchText ? getPOS(searchText) : [];
                return results;
            };

        });
