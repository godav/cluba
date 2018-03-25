(function () {

    angular.module('app').service("USERS",
            function ($firebaseObject, $firebaseArray, Auth, $q, $infiniteScroll) {
                if (Auth) {

                    var UsersRef = firebase.database().ref('users');
                    var FriendsRef = firebase.database().ref('friends');
                    var NotificationsRef = firebase.database().ref('notifications');
                    
                    this.getUser = function (Key) {
                        var one = $q.defer();
                        var user = $firebaseObject(UsersRef.child(Key));

                        user.$loaded().then(function () {

                            one.resolve(user);

                        });

                        // Avner remmber that you didn't handle errores in load userr object. For later add catch

                        return one.promise;
                    };

                    this.getUserFreinds = function (userId) {

                        return facebookFriendSuggestion()
                                .then(function (faceFriends) {
                                    return convertFaceObjToFirebaseObj(faceFriends);
                                }).then(function (Friends) {
                            return checkIfAlreadyFriend(Friends, userId);
                        });



                    };

                    this.getUserNotificationsRef = function (userId) {
                        console.log(userId);
                        var notificationQuery = NotificationsRef.child(userId).orderByChild("active");
                         console.log(notificationQuery);
                        array = $infiniteScroll(notificationQuery, 10);
                        return array;
                    };



                    function facebookFriendSuggestion() {
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
                    }

                    function convertFaceObjToFirebaseObj(faceFriends)
                    {

                        console.log(faceFriends);
                        var one = $q.defer();
                        var firebaseUsers = {};
                        var promises = [];
                        faceFriends.forEach(function (friend) {
                            var promise = UsersRef.orderByChild('facebookId').equalTo(Number(friend.id)).once('value').then(function (snapshot) {

                                var user = snapshot.val();
                                var key = Object.keys(user);

                                firebaseUsers[key[0]] = user[key[0]];

                            });
                            promises.push(promise);
                        });
                        $q.all(promises).then(function () {
                            console.log('finish all promises');
                            console.log(firebaseUsers);
                            one.resolve(firebaseUsers);
                        });
                        return one.promise;



                    }
                    function checkIfAlreadyFriend(Friends, userId)
                    {
                        console.log('last callback');

                        var one = $q.defer();
                        var firebaseUsers = [];
                        var promises = [];

                        Object.keys(Friends).forEach(function (key) {

                            console.log('inside last loop');

                            var promise = FriendsRef.child(userId).child(key).once('value').then(function (snapshot) {
                                if (!snapshot.val())
                                {
                                    Friends[key].id = key;
                                    firebaseUsers.push(Friends[key]);
                                }


                            });
                            promises.push(promise);
                        });
                        $q.all(promises).then(function () {
                            console.log('finish second promises');
                            console.log(firebaseUsers);
                            one.resolve(firebaseUsers);
                        });
                        return one.promise;



                    }


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