angular
        .module('app')
        .controller('managmentProfileCtrl', function ($scope, $timeout, $clubToast, $state, $stateParams, currentClub, $q, clubPO) {


            var root = firebase.database().ref();
//            var clubRef = root.child('clubes');
            var rolesRef = root.child('roles');
            var UsersRef = root.child('users');
            var clubPORef = root.child('clubPO');      // new node for saving the relation between club and po in club
//            var rolesRef = firebase.database().ref('roles');
            $scope.club = currentClub;
            $scope.selectedItem = null;
            $scope.searchText = null;


            $scope.selectedUsers = clubPO;

            var po_removed = [];                // use to disable po the dis granted permmision to a club
            var po_added = [];                // use to add new po to granted permmision to a club
            var po_updated = false;             // used to check if po permision updated



            $scope.image2 = {};
            $scope.imageLogo = {};

            $scope.check = function () {
                console.log($scope.club.address);
            };

            // this function handle the PO permission adding and removing from chip
            function update_po_role()
            {
                if (po_updated) {


                    po_added.forEach(function (item) {
                        var userRef = rolesRef.child(item.key);
                        var newClubRole = userRef.child($scope.club.$id);
                        //check what permision user have in club, if not assign PO permision
                        newClubRole.once("value", function (snapshot) {

                            if (snapshot.val() === null || (snapshot.val().active === false && snapshot.val().role === 3))
                            {
                                clubPORef.child($scope.club.$id).child(item.key).update({
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

                        clubPORef.child($scope.club.$id).child(item.key).once("value", function (snapshot) {

                            if (snapshot.val().active)
                                clubPORef.child($scope.club.$id).child(item.key).update({
                                    active: false
                                });
                        });

                        // still need to take care in user role in the users node ( Avner remember to deal with it).
                    });

                }
            }



            $scope.updateClub = function () {
                console.log($scope.clubForm.$valid);
                if ($scope.clubForm.$valid) {
                    $scope.upload = true;
                    if (angular.equals($scope.image2, {}) && angular.equals($scope.imageLogo, {}))
                    {
                        saveClub();
                        
                    } else if (!angular.equals($scope.image2, {}) && angular.equals($scope.imageLogo, {}))
                    {

                        var imagesRef = firebase.storage().ref('clubes/' + $scope.club.$id + '/profile/profile.jpg');
                        imagesRef.putString($scope.image2.resized.dataURL, 'data_url').then(function (snapshot) {

                            $scope.club.clubPicture = snapshot.metadata.downloadURLs[0];
                            
                            saveClub();
                            clearImage();

                        }), function (error) {
                            $clubToast.show('חלה שגיאה בהעלאת התמונה!', 'clubProfile', 'error');
                            console.log(error);
                        };
                    } else if (angular.equals($scope.image2, {}) && !angular.equals($scope.imageLogo, {}))
                    {

                        var logoRef = firebase.storage().ref('clubes/' + $scope.club.$id + '/profile/logo.jpg');
                        logoRef.putString($scope.imageLogo.resized.dataURL, 'data_url').then(function (snapshot) {

                            $scope.club.imageLogo = snapshot.metadata.downloadURLs[0];
                            
                            saveClub();
                            clearLogo();

                        }), function (error) {
                            $clubToast.show('חלה שגיאה בהעלאת הלוגו!', 'clubProfile', 'error');
                            console.log(error);
                        };
                    } else if (!angular.equals($scope.image2, {}) && !angular.equals($scope.imageLogo, {}))
                    {

                        var logoRef = firebase.storage().ref('clubes/' + $scope.club.$id + '/profile/logo.jpg');
                        logoRef.putString($scope.imageLogo.resized.dataURL, 'data_url').then(function (snapshot) {
                            $scope.club.imageLogo = snapshot.metadata.downloadURLs[0];

                            var imagesRef = firebase.storage().ref('clubes/' + $scope.club.$id + '/profile/profile.jpg');
                            imagesRef.putString($scope.image2.resized.dataURL, 'data_url').then(function (snapshot) {

                                $scope.club.clubPicture = snapshot.metadata.downloadURLs[0];
                                
                                saveClub();
                                clearImage();
                                clearLogo();
                                
                            }), function (error) {
                                $clubToast.show('חלה שגיאה בהעלאת התמונה!', 'clubProfile', 'error');
                                console.log(error);
                            };
                        }), function (error) {
                            $clubToast.show('חלה שגיאה בהעלאת הלוגו!', 'clubProfile', 'error');
                            console.log(error);
                        };
                    } else
                    {

                    }
                    $scope.upload = false;
                }
            };

            function clearImage() {
                $scope.image2.file = undefined;
                $scope.image2.url = undefined;
                $scope.image2.dataURL = undefined;
                $scope.image2.resized.dataURL = undefined;
                $scope.image2.resized.type = undefined;
            }

            function clearLogo() {
                $scope.imageLogo.file = undefined;
                $scope.imageLogo.url = undefined;
                $scope.imageLogo.dataURL = undefined;
                $scope.imageLogo.resized.dataURL = undefined;
                $scope.imageLogo.resized.type = undefined;
            }

            function saveClub()
            {
                $scope.club.active = true;
                var cTime = new Date();
                $scope.club.open = cTime.getTime();
                $scope.club.$save().then(function () {
                    update_po_role();
                    $clubToast.show('פרופיל המועדון עודכן', 'clubProfile', 'success');
                }, function (error) {
                    $clubToast.show('חלה שגיאה בעדכון!', 'clubProfile', 'error');
                    console.log(error);
                });
            }

            $scope.$watchCollection('selectedUsers', function (newVal, oldVal) {
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

            $scope.$watch('image2', function () {
                console.log($scope.image2);
                if ($scope.image2.resized && $scope.image2.resized.dataURL) {
                    $timeout(function () {
                        $scope.club.clubPicture = $scope.image2.resized.dataURL;
                        // anything you want can go here and will safely be run on the next digest.
                    });
                } else {
                    console.log('in elsse');
                    $scope.clubPicture = "img/empty-club.jpg";
                }
            });

            $scope.$watch('imageLogo', function () {
                if ($scope.imageLogo.resized && $scope.imageLogo.resized.dataURL) {
                    console.log($scope.imageLogo);
                    $timeout(function () {
                        $scope.club.clubLogo = $scope.imageLogo.resized.dataURL;
                        // anything you want can go here and will safely be run on the next digest.
                    });
                } else
                    $scope.clubLogo = "img/empty-logo.png";
            });

            $scope.$watch('club.address.city', function () {
                $timeout(function () {
                    $scope.clubForm.address.$setValidity("city", $scope.club.address.city !== undefined && $scope.club.address.city !== "");
                    $scope.$apply();
                });
            });

            $scope.$watch('club.address.street', function () {
                $timeout(function () {
                    $scope.clubForm.address.$setValidity("street", $scope.club.address.street !== undefined && $scope.club.address.street !== "");
                    $scope.$apply();
                });
            });

            $scope.$watch('club.address.country', function () {
                $timeout(function () {
                    $scope.clubForm.address.$setValidity("country", $scope.club.address.country !== undefined && $scope.club.address.country !== "");
                    $scope.$apply();
                });
            });

            $scope.$watch('club.address.streetNumber', function () {
                $timeout(function () {
                    $scope.clubForm.address.$setValidity("streetNumber", $scope.club.address.streetNumber !== undefined && $scope.club.address.streetNumber !== "");
                    $scope.$apply();
                });
            });

            $scope.goParties = function () {
                $state.go('managment.parties', {clubId: $stateParams.clubId, role: $stateParams.role});
            };

            $scope.goPermissions = function () {
                $state.go('managment.permmisions', {clubId: $stateParams.clubId, role: $stateParams.role});
            };



            /* Functions that handels PO permissions to a club */

            $scope.isEmpty = function () {
                if ($scope.selectedUsers.length > 0)
                    return false;
                else
                    return true;
            };

            function getUsers(searchText) {
                var one = $q.defer();
                var users = [];
                UsersRef
                        .orderByChild('phone')
                        .startAt(searchText)
                        .endAt(searchText + "\uf8ff")
                        .once('value', function (snapshot) {
                            snapshot.forEach(function (childSnapshot) {
                                rolesRef.child(childSnapshot.key).child(currentClub.$id).once("value", function (snapshot) {

                                    if (snapshot.val() === null || (snapshot.val().active === false && snapshot.val().role === 3))
                                        users.push({"key": childSnapshot.key, "name": childSnapshot.val().first_name + " " + childSnapshot.val().last_name});
                                    one.resolve(users);
                                });
                            });
                        });
                return one.promise;
            }

            $scope.updateUsers = function (searchText) {
                var results = searchText ? getUsers(searchText) : [];
                return results;
            };

        });
