(function () {

    angular.module('app').controller("phoneCtrl",
            function ($scope, $state, Auth, $mdDialog, userObj, currentAuth, $location, $window, $timeout) {

                // initialize all of the important varibles at controller load.
                // https://github.com/jestcastro/cordova-plugin-firebase#phone-authentication
                // keytool -exportcert -alias androiddebugkey -keystore %USERPROFILE%\.android\debug.keystore -list -v

                function init()
                {
                    $scope.tel = '';
                    $scope.verificationCode = '';
                    $scope.isPhoneOK = false;
                    $scope.countryId = '';               // for now put only israel for testing later their is plugin of google to get all countries.
                    $scope.userPhone = '';
                    $scope.isSignIn = true;
                    $scope.isVerification = false;
                    $scope.credential = null;
                    $scope.isSent = true;
                }

                init();

                $scope.checkPhone = function (a) {

                    var countryData = $("#tel").intlTelInput("getSelectedCountryData");
                    var isValid = $("#tel").intlTelInput("isValidNumber");

                    $scope.userPhone = a.$viewValue;
                    $scope.countryId = countryData.dialCode;

                    if (isValid) {
                        if ($scope.countryId === "972")
                            if (checkPhone())
                                $scope.isPhoneOK = true;
                            else
                                $scope.isPhoneOK = false;
                        else
                            $scope.isPhoneOK = true;
                    } else
                        $scope.isPhoneOK = false;

                };

                // check israeli phone because their is problem with validation format for israeli numbers
                function checkPhone() {
                    if ($scope.userPhone.length === 10) {
                        return true;
                    } else {
                        return false;
                    }
                }
                ;

                $scope.checkCode = function () {

                    if (!$scope.verificationCode || $scope.verificationCode.toString().length !== 6) {
                        $scope.codeComplete = false;
                    } else {
                        $scope.codeComplete = true;
                    }
                };


                /**
                 * function called when clicking the login/logout button.
                 */
                $scope.signInSub = function () {

                    // [start signin]
                    console.log($scope.tel.toString());

                    $window.FirebasePlugin.verifyPhoneNumber($scope.tel.toString(), 60, function (credential) {
                        console.log('send');
                        console.log(credential);
                        $scope.credential = credential;

                        if ($scope.isVerification) {
                            $scope.isSent = false;
                            $timeout(function () {
                                $scope.isSent = true;
                            }, 3000);
                        }
                        $scope.$apply(function () {
                            console.log('in apply');

                            updateVerificationCodeFormUi();
                            updateSignInFormUi();



                        });
                        // ask user to input verificationCode:
                        console.log('after applly');
                    }, function (error) {
                        console.log(error);

                    });

                };

                /**
                 * function called when clicking the "verify code" button.
                 */
                $scope.onVerifyCodeSubmit = function () {

                    console.log($scope.credential.verificationId);
                    console.log($scope.verificationCode);
                    console.log(currentAuth);
                    console.log(Auth);
                    // [start verifycode]
                    var credential = firebase.auth.PhoneAuthProvider.credential($scope.credential.verificationId, $scope.verificationCode.toString());
                    console.log(credential);

                    // link user phone auth to facebook auth on the same instance in firebase
                    currentAuth.linkWithCredential(credential).then(function (user) {
                        console.log(user);
                        userObj.phone = $scope.userPhone;
                        userObj.$save();
                        $location.path('/main');
//                    $state.go('clubears.main');
                    }, function (error) {
                        console.log(error);
                        console.log(angular.equals(error.code, "auth/provider-already-linked"));
                        if (angular.equals(error.code, "auth/provider-already-linked")) {
                            console.log('in if');
                            console.log(userObj);
                            console.log($scope.userPhone);
                            userObj.phone = $scope.userPhone;
                            userObj.$save();
                            $state.go('clubears.main.clubes');
                        } else if (angular.equals(error.code, "auth/credential-already-in-use")) {


                            // Appending dialog to document.body to cover sidenav in docs app
                            // Modal dialogs should fully cover application
                            // to prevent interaction outside of dialog
                            $mdDialog.show(
                                    $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('אימות טלפון')
                                    .textContent('מספר טלפון זה אומת כבר על ידי משתמש אחר, יש לאמת את מספר הטלפון מחדש!')
                                    .ariaLabel('אזהרה')
                                    .ok('הבנתי')
                                    // You can specify either sting with query selector
                                    .openFrom('#right')
                                    // or an element
                                    .closeTo(angular.element(document.querySelector('#left')))

                                    ).then(function () {

                                init();

                            });


                        } else if (angular.equals(error.code, "auth/code-expired")) {


                            // Appending dialog to document.body to cover sidenav in docs app
                            // Modal dialogs should fully cover application
                            // to prevent interaction outside of dialog
                            $mdDialog.show(
                                    $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('אימות טלפון')
                                    .textContent('קוד האימות שהוקלד פג תוקף. נא אמתו את הקוד מחדש על מנת לנסות שוב.')
                                    .ariaLabel('אזהרה')
                                    .ok('הבנתי')
                                    // You can specify either sting with query selector
                                    .openFrom('#right')
                                    // or an element
                                    .closeTo(angular.element(document.querySelector('#left')))

                                    ).then(function () {

                                $scope.verificationCode = '';
                                $scope.codeComplete = false;

                            });


                        } else if (angular.equals(error.code, "auth/invalid-verification-code")) {


                            // Appending dialog to document.body to cover sidenav in docs app
                            // Modal dialogs should fully cover application
                            // to prevent interaction outside of dialog
                            $mdDialog.show(
                                    $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('אימות טלפון')
                                    .textContent('קוד האימות שהוקלד אינו תקין, נא לנסות מחדש!')
                                    .ariaLabel('אזהרה')
                                    .ok('הבנתי')
                                    // You can specify either sting with query selector
                                    .openFrom('#right')
                                    // or an element
                                    .closeTo(angular.element(document.querySelector('#left')))

                                    ).then(function () {

                                $scope.verificationCode = '';
                                $scope.codeComplete = false;

                            });


                        } else {
                            $mdDialog.show(
                                    $mdDialog.alert()
                                    .clickOutsideToClose(true)
                                    .title('אימות טלפון')
                                    .textContent('אירעה שגיאה באימות הקוד, אנא נסו שוב מאוחר יותר!')
                                    .ariaLabel('אזהרה')
                                    .ok('הבנתי')
                                    // You can specify either sting with query selector
                                    .openFrom('#right')
                                    // or an element
                                    .closeTo(angular.element(document.querySelector('#left')))

                                    ).then(function () {

                                $scope.verificationCode = '';
                                $scope.codeComplete = false;

                            });

                        }
                    });
                    // [end verifycode]

                };

                /**
                 * cancels the verification code input.
                 */
                $scope.cancelVerification = function () {

                    init();
                };

                /**
                 * updates the state of the sign-in form (used for ng-show).
                 */
                function updateSignInFormUi() {
                    if ($scope.credential)
                    {
                        $scope.isSignIn = false;
                    } else
                        $scope.isSignIn = true;
                }

                /**
                 * updates the state of the verify code form (used for ng-show).
                 */
                function updateVerificationCodeFormUi() {
                    if ($scope.credential) {
                        $scope.isVerification = true;
                    } else {
                        $scope.isVerification = false;
                    }
                }


                Auth.$onAuthStateChanged(function (authdata) {

                    updateSignInFormUi();
                    updateVerificationCodeFormUi();

                });
            }
    );

})();