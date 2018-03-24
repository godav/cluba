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



                    this.AddFriend = function (Friend, Key) {
                        console.log('add friend');
                        console.log(Friend);
                        FriendsRef.child(Key).child(Friend.id).set({active:false});
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