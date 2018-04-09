(function () {

    angular.module('app').service("FRIENDS",
            function ($timeout, $firebaseArray, Auth, $q, $infiniteScroll) {
                if (Auth) {

                    var FriendsRef = firebase.database().ref('friends');

                    this.getUserFriends = function (userId) {
                        console.log('inside getUserFriends');
                        console.log(userId);

                        var friendsQuery = FriendsRef.child(userId).orderByChild("active_name").startAt("1_").endAt("1_" + "\uf8ff");
                        ;
                        console.log(friendsQuery);
                        var array = $infiniteScroll(friendsQuery, 10);
                        console.log(array);
                        return array;
                    };



                    this.AddFriend = function (Friend, Me) {
                        console.log('add friend');
                        console.log(Friend);
                        FriendsRef.child(Me.uid).child(Friend.id).set(
                                {
                                    displayName: Friend.first_name + " " + Friend.last_name,
                                    picture: Friend.picture,
                                    created: Date.now(),
                                    active_name: "0"
                                });
                        FriendsRef.child(Friend.id).child(Me.uid).set(
                                {
                                    displayName: Me.displayName,
                                    picture: Me.photoURL,
                                    created: Date.now(),
                                    active_name: "0"
                                });
                    };

                    this.ConfirmFriend = function (friendId, friendName, Me) {
                        console.log('confirm friend');
                        FriendsRef.child(friendId).child(Me.uid).update({active_name: "1_" + friendName[0]});
                        FriendsRef.child(Me.uid).child(friendId).update({active_name: "1_" + Me.displayName[0]});
                    };

                    this.RejectFriend = function (friendId, myId) {
                        console.log('reject friend');
                        FriendsRef.child(myId).child(friendId).remove();
                        $timeout(10);
                        FriendsRef.child(friendId).child(myId).remove();
                    };

//
//                    this.UpdateUser = function (User) {
//                        User.save();
//
//                    };
//
//                    this.DeleteUser = function (UserKey) {
//                        var OneUserRef = UserRef.child(UserKey);
//                        OneUserRef.remove();
//                    };
//
//                    this.GetAllUsers = function () {
//                        return $firebaseArray(UserRef);
//                    };
//
//                    this.GetOneUser = function (UserKey) {
//                        var OneItemRef = $firebaseObject(UserRef.child(UserKey));
//                        console.log(OneItemRef);
//                        return $firebaseObject(OneItemRef);
//                    };
                }
                ;


            });
})();