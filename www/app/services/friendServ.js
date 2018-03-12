(function () {

    angular.module('app').service("FRIENDS",
            function ($firebaseObject, $firebaseArray, Auth, $q, $infiniteScroll) {
                if (Auth) {

                    var FriendsRef = firebase.database().ref('friends');

                    this.getUserFriends = function (userId) {
                        var friendsQuery = FriendsRef.child(userId);
                        array = $infiniteScroll(friendsQuery, 15);
                        return array;
                    };

//
//
//                    this.AddFriend = function (Friend, Key) {
//                        console.log('add friend');
//                        FriendsRef.child(Key).set(Friend);
//                    };
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