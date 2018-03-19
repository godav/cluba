(function () {

    angular.module('app').service("USERS",
            function ($firebaseObject, $firebaseArray, Auth, $q) {
                if (Auth) {

                    var UsersRef = firebase.database().ref('users');

                    this.getUser = function (Key) {
                        var one = $q.defer();
                        var user = $firebaseObject(UsersRef.child(Key));

                        user.$loaded().then(function () {

                            one.resolve(user);

                        });

                        // Avner remmber that you didn't handle errores in load userr object. For later add catch

                        return one.promise;
                    };

                    this.getUserFreinds = function () {
//                        var one = $q.defer();
//                        var userExists = {};
//                        var promises = [];
//                        clubesEvents.forEach(function (event) {
//                            var EventsUsersRef = firebase.database().ref('UsersInEvent/' + clubId + '/' + event.$id + '/' + userId);
//                            var promise = EventsUsersRef.once('value').then(function (snapshot) {
//
//                                if (snapshot.hasChild('approved')) {
//                                    userExists[event.$id] = true;
//                                } else
//                                    userExists[event.$id] = false;
//                            });
//                            promises.push(promise);
//                        });
//                        $q.all(promises).then(function () {
//                            one.resolve(userExists);
//                        });
//                        return one.promise;




                        var one = $q.defer();
                        facebookConnectPlugin.api("/me/friends" + '?fields=id,first_name,last_name,picture', [],
                                function (result) {
                                    console.log(result);
                                    one.resolve(result.data);
                                },
                                function (error) {
                                    console.log(error);

                                });
                        return one.promise;
                    };


                    this.AddUser = function (User, Key) {
                        console.log('add user');
                        firebase.database().ref().child('users').child(Key).set(User);
                    };

                    this.UpdateUser = function (User) {
                        User.save();

                    };


                    this.saveDeviceToken = function (cId, newToken) {
                        UsersRef.child(cId).update({token: newToken});
                    };

                    this.DeleteUser = function (UserKey) {
                        var OneUserRef = UserRef.child(UserKey);
                        OneUserRef.remove();
                    };

                    this.GetAllUsers = function () {
                        return $firebaseArray(UserRef);
                    };

                    this.GetOneUser = function (UserKey) {
                        var OneItemRef = $firebaseObject(UserRef.child(UserKey));
                        console.log(OneItemRef);
                        return $firebaseObject(OneItemRef);
                    };
                }
                ;

//                this.registerUser = function (clubKey, eventKey, User) {
//
//                    var root = firebase.database().ref();
//                    var regRef = root.child('registeration');
//
//                    var clubRef = regRef.child(clubKey);
//                    var eventRef = clubRef.child(eventKey);
//                    var userRef = eventRef.child(User.$id);
//                    
//                     var regDetails = {
//                            active: false,
//                            open: "",
//                            name: "חדש",
//                            reg: true,
//                            approved:"",
//                                                         
//                           
//                            photo: "img/empty-club.jpg"
//                           
//                        };
//                    
//                    var newEvent = clubRef.push();
//                    newEvent.set(Event);
//
//
//                    var OneItemRef = $firebaseObject(UserRef.child(UserKey));
//                    console.log(OneItemRef);
//                    return $firebaseObject(OneItemRef);
//                };


            });
})();