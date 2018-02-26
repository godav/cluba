(function () {

    angular.module('app').
            service("CLUBES", function ($firebaseObject, $firebaseArray, Auth, $q) {
                if (Auth) {

                    var ClubesRef = firebase.database().ref('clubes');
                    var ClubPOList = firebase.database().ref('clubPO');
                    var array = null;
//                    		https://codepen.io/elliotmendiola/pen/JNYoNj	               

                    this.openClub = function () {
                        var root = firebase.database().ref();
                        var clubRef = root.child('clubes');
                        var clubObj = {
                            active: false,
                            open: "",
                            name: "חדש",
                            capacity: "",
                            address: {},
                            clubPicture: "img/empty-club.jpg",
                            clubLogo: "img/empty-logo.png",
                            description: null
                        };
                        clubObj.address.name = "";
                        clubObj.address = {placeId: "", streetNumber: "", street: "", city: "", state: "", countryCode: "", country: ""};
                        clubObj.location = {lat: "", long: ""};
                        var newClub = clubRef.push(clubObj);
                        return newClub;
                    };

                    this.getClubesUserAssign = function (clubes) {

                        var Clubes = [];
                        angular.forEach(clubes, function (value, key) {
                            var ref = $firebaseObject(ClubesRef.child(key)).$loaded();
                            Clubes.push(ref);
                        });
                        return $q.all(Clubes);
                    };

                    this.GetFirstEvents = function () {
                        var currentDate = new Date();
                        currentDate.setHours(0, 0, 0, 0);
                        var eventQuery = ClubesRef.orderByChild("eDate").startAt(currentDate.getTime());
                        array = $infiniteScroll(eventQuery, 10);
                        return array;
                    };

                    this.GetOneClub = function (clubKey) {
                        var one = $q.defer();
                        var club = $firebaseObject(ClubesRef.child(clubKey));
                        club.$loaded().then(function () {
                            one.resolve(club);
                        });
                        // Avner remmber that you didn't handle errores in load userr object. For later add catch
                        return one.promise;
                    };

                    this.GetClubPOActive = function (clubKey) {
                        var one = $q.defer();
                        ClubPOList.child(clubKey).child("POS").once('value').then(function (snapshot) {
                            var users = [];
                            snapshot.forEach(function (childSnapshot) {
                                if (childSnapshot.val().active)
                                    users.push({"key": childSnapshot.key, "name": childSnapshot.val().name});
                                // ...
                            });
                            $q.all(users).then(function (values) {
                                one.resolve(values);
                            });
                        });
                        return one.promise;

//                        // Avner remmber that you didn't handle errores in load userr object. For later add catch

                    };

                    this.GetClubManagersActive = function (clubKey) {
                        var one = $q.defer();
                        ClubPOList.child(clubKey).child("managers").once('value').then(function (snapshot) {
                            var users = [];
                            snapshot.forEach(function (childSnapshot) {
                                if (childSnapshot.val().active)
                                    users.push({"key": childSnapshot.key, "name": childSnapshot.val().name});
                                // ...
                            });
                            $q.all(users).then(function (values) {
                                one.resolve(values);
                            });
                        });
                        return one.promise;

//                        // Avner remmber that you didn't handle errores in load userr object. For later add catch

                    };

                    this.GetClubesNearBy = function () {
                        var one = $q.defer();
                        var clubes = $firebaseArray(ClubesRef);
                        clubes.$loaded().then(function () {
                            one.resolve(clubes);
                        });
                        // Avner remmber that you didn't handle errores in load userr object. For later add catch
                        return one.promise;
                    };
                }
                ;
            });
})(); 