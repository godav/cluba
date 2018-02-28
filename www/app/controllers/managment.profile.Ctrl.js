angular
        .module('app')
        .controller('managment.profile.Ctrl', function ($scope, $timeout, $clubToast, $state, $stateParams, currentClub, $q, clubPO) {


            var root = firebase.database().ref();

            var initialClub = {
                address: currentClub.address,
                capacity: currentClub.capacity,
                clubLogo: currentClub.clubLogo,
                clubPicture: currentClub.clubPicture,
                location: currentClub.location,
                name: currentClub.name,
                description: currentClub.description
            };
            $scope.club = currentClub;

            $scope.updated = false;
            $scope.geoUpdate = false;

            $scope.updatedFlags = {
                name: false,
                lat: false,
                long: false,
                capacity: false,
                description: false,
                logo: false,
                picture: false
            };

            $scope.image2 = {};
            $scope.imageLogo = {};

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
                if (!$scope.club.active) {
                    var cTime = new Date();
                    $scope.club.open = cTime.getTime();
                    $scope.club.active = true;
                }
                $scope.club.$save().then(function () {
                    console.log($scope.club);
                    if ($scope.geoUpdate)
                    {
                        var geoClub = root.child('geoClubes').child($scope.club.$id);
                        var geoObj = {
                            active: true,
                            name: $scope.club.name,
                            logo: $scope.club.clubLogo,
                            latitude: $scope.club.location.lat,
                            longitude: $scope.club.location.long

                        };
                        geoClub.update(geoObj);
                    }
                    $clubToast.show('פרופיל המועדון עודכן', 'clubProfile', 'success');
                }, function (error) {
                    $clubToast.show('חלה שגיאה בעדכון!', 'clubProfile', 'error');
                    console.log(error);
                });


            }

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
            }, true);

            $scope.$watch('imageLogo', function () {
                if ($scope.imageLogo.resized && $scope.imageLogo.resized.dataURL) {
                    console.log($scope.imageLogo);
                    $timeout(function () {
                        $scope.club.clubLogo = $scope.imageLogo.resized.dataURL;
                        // anything you want can go here and will safely be run on the next digest.
                    });
                } else
                    $scope.clubLogo = "img/empty-logo.png";
            }, true);

            $scope.$watch('club.address.city', function (newVal, oldVal) {
                $timeout(function () {
                    $scope.clubForm.address.$setValidity("city", $scope.club.address.city !== undefined && $scope.club.address.city !== "");
                    $scope.$apply();
                });
            });

            $scope.$watch('club.address.street', function (newVal, oldVal) {
                $timeout(function () {
                    $scope.clubForm.address.$setValidity("street", $scope.club.address.street !== undefined && $scope.club.address.street !== "");
                    $scope.$apply();
                });
            });

            $scope.$watch('club.address.country', function (newVal, oldVal) {
                $timeout(function () {
                    $scope.clubForm.address.$setValidity("country", $scope.club.address.country !== undefined && $scope.club.address.country !== "");
                    $scope.$apply();
                });
            });

            $scope.$watch('club.address.streetNumber', function (newVal, oldVal) {
                $timeout(function () {
                    $scope.clubForm.address.$setValidity("streetNumber", $scope.club.address.streetNumber !== undefined && $scope.club.address.streetNumber !== "");
                    $scope.$apply();
                });
            });

            $scope.$watch('club.name', function (newVal, oldVal) {
                if (!newVal)
                    newVal = '';
                if (!oldVal)
                    oldVal = '';
                console.log(newVal);
                console.log(oldVal);
                console.log(initialClub.name);
                if (newVal !== oldVal && newVal !== initialClub.name) {
                    $scope.updatedFlags.name = true;
                } else if (newVal === initialClub.name)
                {
                    $scope.updatedFlags.name = false;
                }
            });

            $scope.$watch('club.clubPicture', function (newVal, oldVal) {
                if (!newVal)
                    newVal = '';
                if (!oldVal)
                    oldVal = '';

                if (newVal !== oldVal && newVal !== initialClub.clubPicture) {
                    $scope.updatedFlags.picture = true;
                } else if (newVal === initialClub.clubPicture)
                {
                    $scope.updatedFlags.picture = false;
                }
            });

            $scope.$watch('club.clubLogo', function (newVal, oldVal) {
                if (!newVal)
                    newVal = '';
                if (!oldVal)
                    oldVal = '';

                if (newVal !== oldVal && newVal !== initialClub.clubLogo) {
                    $scope.updatedFlags.logo = true;
                } else if (newVal === initialClub.clubLogo)
                {
                    $scope.updatedFlags.logo = false;
                }
            });

            $scope.$watch('club.capacity', function (newVal, oldVal) {

                if (!newVal)
                    newVal = '';
                if (!oldVal)
                    oldVal = '';

                if (newVal !== oldVal && newVal !== initialClub.capacity) {
                    $scope.updatedFlags.capacity = true;
                } else if (newVal === initialClub.capacity)
                {
                    $scope.updatedFlags.capacity = false;
                }
            });


            $scope.$watch('club.description', function (newVal, oldVal) {
                if (!newVal)
                    newVal = '';
                if (!oldVal)
                    oldVal = '';

                if (newVal !== oldVal && newVal !== initialClub.description) {
                    $scope.updatedFlags.description = true;
                } else if (newVal === initialClub.description)
                {
                    $scope.updatedFlags.description = false;
                }
            });

            $scope.$watch('club.location.lat', function (newVal, oldVal) {
                if (!newVal)
                    newVal = '';
                if (!oldVal)
                    oldVal = '';

                if (newVal !== oldVal && newVal !== initialClub.location.lat) {
                    $scope.updatedFlags.lat = true;
                } else if (newVal === initialClub.location.lat)
                {
                    $scope.updatedFlags.lat = false;
                }
            });

            $scope.$watch('club.location.long', function (newVal, oldVal) {
                if (!newVal)
                    newVal = '';
                if (!oldVal)
                    oldVal = '';

                if (newVal !== oldVal && newVal !== initialClub.location.long) {
                    $scope.updatedFlags.long = true;
                } else if (newVal === initialClub.location.long)
                {
                    $scope.updatedFlags.long = false;
                }
            });


            $scope.$watch('updatedFlags', function (newVal, oldVal) {
                console.log('updatedFlags');
                console.log(newVal);
                console.log(oldVal);

                if (!newVal.name && !newVal.lat && !newVal.long && !newVal.capacity && !newVal.description && !newVal.logo && !newVal.picture)
                    $scope.updated = false;
                else
                    $scope.updated = true;
            }, true);


            $scope.goParties = function () {
                $state.go('managment.parties', {clubId: $stateParams.clubId, role: $stateParams.role});
            };

            $scope.goPermissions = function () {
                $state.go('managment.permmisions', {clubId: $stateParams.clubId, role: $stateParams.role});
            };

        });
