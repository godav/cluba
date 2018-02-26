
(function () {

    angular.module('app').controller("loginCtrl",
            function ($scope, Auth, $state, currentAuth, USERS, userObj, $firebaseObject, $rootScope) {

                $scope.currentAuth = currentAuth;
                $scope.isNotFire = false;


                /**
                 * Function called when clicking the Login/Logout button.
                 */
                // [START buttoncallback]
                $scope.SignIn = function () {
                    //    keytool -genkey -v -keystore c:\clubears.keystore -storepass android -alias clubears -keypass android -dname "CN=Android Debug,O=Android,C=US" -keyalg RSA -keysize 2048 -validity 10000
                    //    keytool -exportcert -alias clubears -keystore clubears.keystore> c:\openssl\bin\debug.txt

                    var fbLoginSuccess = function (userData) {

                        facebookConnectPlugin.getLoginStatus(statusCheckSuccess, statusCheckFail);

                        function statusCheckSuccess(response) {
                            console.log('before face')
                            if (response.status === 'connected') {
                                // you can get user data here or redirect to main page depending on your goals
                                console.log('loged in ok');
                                console.log(response);

                                var credential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);


                                Auth.$signInWithCredential(credential).then(function (firebaseUser) {
                                    console.log(firebaseUser);
                                    console.log("Signed in as:", firebaseUser.uid);
                                    if (userObj && userObj.email && userObj.phone)
                                    {
                                        $scope.isNotFire = true;
                                        $state.go('clubears.main.clubes');                   // send user to profile because everything is good and stored
                                    }

                                }).catch(function (error) {

                                    console.error("Firebase Authentication failed:", error);
                                });

                            } else {
                                console.log('user not connected facebook');
                                console.log(response);
                                $state.go('login');
                                // here you can call login or redirect to login page
                            }
                        }

                        function statusCheckFail() {
                            // any actions to handle exceptions
                            console.log('ustatusCheckFail');
                            $state.go('login');

                        }

                    };

                    facebookConnectPlugin.login(["public_profile", "email", "user_friends"], fbLoginSuccess,
                            function (error) {
                                alert('error in login');
                                console.error(error);
                            }
                    );

                };


                Auth.$onAuthStateChanged(function (authData) {
                    console.log(authData);

                    if (authData && !$scope.isNotFire)

                    {

                        facebookConnectPlugin.getLoginStatus(statusCheckSuccess, statusCheckFail);

                    }


                    function statusCheckSuccess(response) {
                        console.log('before face')
                        if (response.status === 'connected') {
                            handleFirebaseAuthFlow();
                        } else {

                            console.log('user not connected facebook so he need to press the button');
                        }
                    }

                    function statusCheckFail() {
                        // any actions to handle exceptions

                        console.log('somthing went wrong with the checking might be interent connection');
                    }

                    function handleFirebaseAuthFlow() {
                        if (userObj) {
                            console.log('wired that it come inside');
                            console.log(userObj);
                            if (userObj.phone) {

                                $state.go('clubears.main.clubes');                   // send user to profile because everything is good and stored
                            } else {

                                $state.go('phone');                     // send user to auth phone incase phone not stored on DB
                                //    console.log(USERS.getUser());
                            }
                        } else if (!userObj) {
                            console.log('if false');
                            var UsersRef = firebase.database().ref('users');
                            var user = $firebaseObject(UsersRef.child(authData.uid));

                            user.$loaded().then(function ()
                            {
                                console.log('loaded');
                                console.log(user);
                                if (user.$value === null)
                                {         // first time
                                    facebookConnectPlugin.api("/" + authData.providerData[0].uid + '?fields=id,first_name,last_name,gender,email,picture', [],
                                            function (result) {
                                                console.log(result);
                                                var newUser = {
                                                    email: result.email,
                                                    first_name: result.first_name,
                                                    last_name: result.last_name,
                                                    gender: result.gender,
                                                    picture: result.picture.data.url,
                                                    facebookId: result.id,
                                                    created: Date.now()
                                                };

                                                console.log('before save');
                                                USERS.AddUser(newUser, authData.uid);

                                                $state.go('phone');                     // send user to auth phone incase phone not stored on DB
                                            },
                                            function (error) {

                                                alert("Failed: " + error);
                                                $state.go('login');

                                            });


                                } else if (user.email && user.phone) {

                                    console.log('all OK');
                                    $state.go('clubears.main.clubes');                   // send user to profile because everything is good and stored
                                } else if (!user.email) {

                                    console.log('missing email');
                                    $state.go('login');                                  // send user to login again because for some reason the mail not stored
                                } else if (!user.phone) {

                                    console.log('missing phone');                       // send user to auth phone incase phone not stored on DB
                                    $state.go('phone');
                                }


                            });

                        }
                    }



                });

                // [END buttoncallback]
            }
    );
})();


//(function () {

//    angular.module('app').controller("loginCtrl",
//        function ($scope, Auth, $state, currentAuth, USERS, userObj, $firebaseObject) {

//                $scope.currentAuth = currentAuth;

//                /**
//                 * Function called when clicking the Login/Logout button.
//                 */
//                // [START buttoncallback]
//                $scope.SignIn = function () {
//                //    keytool -genkey -v -keystore c:\clubears.keystore -storepass android -alias clubears -keypass android -dname "CN=Android Debug,O=Android,C=US" -keyalg RSA -keysize 2048 -validity 10000
//                //    keytool -exportcert -alias clubears -keystore clubears.keystore> c:\openssl\bin\debug.txt

//                    var fbLoginSuccess = function (userData) {

//                        facebookConnectPlugin.getLoginStatus(statusCheckSuccess, statusCheckFail);

//                        function statusCheckSuccess(response) {
//                            if (response.status === 'connected') {
//                                // you can get user data here or redirect to main page depending on your goals


//                                var credential = firebase.auth.FacebookAuthProvider.credential(response.authResponse.accessToken);

//                                Auth.$signInWithCredential(credential).then(function (firebaseUser) {
//                                    console.log("Signed in as:", firebaseUser.uid);



//                                }).catch(function (error) {
//                                    console.error("Authentication failed:", error);
//                                });             

//                            } else {
//                                console.log('user not connected');
//                                console.log(response);
//                                // here you can call login or redirect to login page
//                            }
//                        }

//                        function statusCheckFail() {
//                            // any actions to handle exceptions
//                            console.log('ustatusCheckFail');

//                        }

//                    };

//                    facebookConnectPlugin.login(["public_profile","email"], fbLoginSuccess,
//                        function (error) {
//                            alert('error in login');
//                            console.error(error);
//                        }
//                    );


//                };


//                Auth.$onAuthStateChanged(function (authData) {

//                    if (authData) {
//                        console.log('in authData');
//                        if (userObj) {
//                            console.log('if true');
//                            if (userObj.phone)
//                                $state.go('clubears.main.clubes');                   // send user to profile because everything is good and stored
//                            else {
//                                $state.go('phone');                     // send user to auth phone incase phone not stored on DB
//                                //    console.log(USERS.getUser());
//                            }
//                        }
//                        else if (!userObj) {                                // might be user first time in the app or user reInstall the app
//                            console.log('if false');
//                            var UsersRef = firebase.database().ref('users');
//                            var user = $firebaseObject(UsersRef.child(authData.uid));

//                            user.$loaded().then(function () {

//                                if (!user.$value) {
//                                    console.log('not exists');
//                            facebookConnectPlugin.api("/" + authData.providerData[0].id + '?fields=id,first_name,last_name,gender,email,picture', [],
//                                function (result) {

//                                    var newUser = {
//                                        email: result.email,
//                                        first_name: result.first_name,
//                                        last_name: result.last_name,
//                                        gender: result.gender,
//                                        picture: result.picture.data.url,
//                                        created = Date.now()

//                                    }
//                                    USERS.addUser(newUser, authData.uid);                                  
//                                    $state.go('phone');                     // send user to auth phone incase phone not stored on DB
//                                },
//                                function (error) {
//                                    alert("Failed: " + error);
//                                    $state.go('login');

//                                });
//                                }

//                                else if (user.email && user.phone) {
//                                    console.log('all ok');
//                                    $state.go('clubears.main.clubes');                   // send user to profile because everything is good and stored
//                                }

//                                else if (!user.email)
//                                    console.log('missing email');
//                                else if (!user.phone)
//                                    console.log('amissing phone');

//                             //   alert(JSON.stringify(user));

//                            });

//                            console.log('after');




//                        }
//                        else {
//                            //                            console.log(USERS.currentUser);
//                            alert('fatal error login');
//                            $state.go('login');
//                        }
//                    }
//                });
//            }
//    );
//})();