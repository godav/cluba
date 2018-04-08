(function () {

    angular.module('app').service("FRIENDS",
            function ($firebaseObject, $firebaseArray, Auth, $q, $infiniteScroll) {
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



                    this.AddFriend = function (Friend, Key) {
                        console.log('add friend');
                        console.log(Friend);
                        FriendsRef.child(Key).child(Friend.id).set(
                                {
                                    displayName: Friend.first_name + " " + Friend.last_name,
                                    picture: Friend.picture,
                                    created: Date.now(),
                                    active_name: "0"
                                });
                    };

                    this.ConfirmFriend = function (friendId, friendName, me) {
                        console.log('confirm friend');
                        FriendsRef.child(friendId).child(me.uid).update({active_name: "1_" + friendName[0]});
                           console.log(me);
                           
                           var check  =  {
                                    displayName: me.displayName,
                                    picture:  me.photoURL,
                                    created: Date.now(),
                                    active_name: "1_" + me.displayName[0]
                                };
                               console.log(check);    
                        FriendsRef.child(me.uid).child(friendId).update(check);
                    };

                    this.RejectFriend = function (friendId, myId) {
                        console.log('reject friend');
                        FriendsRef.child(myId).child(friendId).remove();
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