(function () {

    angular.module('app').
            service("EVENTS", function ($firebaseObject, Auth, $infiniteScroll, $q, $firebaseArray, $infiniteScrollPending) {
                if (Auth) {

                    var EventsRef = firebase.database().ref('events');
                    var EventsUsersRef = firebase.database().ref('UsersInEvent');
                    var array = null;
//                    		https://codepen.io/elliotmendiola/pen/JNYoNj	               

                    this.AddEvent = function (Event, clubId) {

                        var root = firebase.database().ref();
                        var eventRef = root.child('events');
                        var clubRef = eventRef.child(clubId);
                        var newEvent = clubRef.push();
                        newEvent.set(Event);
                    };

                    this.GetFirstEvents = function (clubId) {
                        var currentDate = new Date();
                        currentDate.setHours(0, 0, 0, 0);
                        var clubRef = EventsRef.child(clubId);
                        var eventQuery = clubRef.orderByChild("eDate").startAt(currentDate.getTime());
                        array = $infiniteScroll(eventQuery, 10);
                        return array;
                    };

                    // stoped here - Avner continue from to do pagination to users in event by group - check firebase rules
                    this.GetUsersInEvent = function (clubId, eventId) {


                        var eventQuery = EventsUsersRef.child(clubId).child(eventId).orderByChild("sent_group").startAt("false_1");
                        array = $infiniteScrollPending(eventQuery, 15);
                        return array;
                    };

                    this.GetUsersInEventByName = function (clubId, eventId) {


                        var eventQuery = EventsUsersRef.child(clubId).child(eventId).orderByChild("name");
                        array = $infiniteScrollPending(eventQuery, 15);
                        return array;
                    };

                    this.SearchUsersByName = function (clubId, eventId, filter) {


                        var eventQuery = EventsUsersRef.child(clubId).child(eventId).orderByChild("name").startAt(filter).endAt(filter + "\uf8ff");
                        array = $infiniteScrollPending(eventQuery, 15);
                        return array;
                    };

                    this.GetUsersInEventByMale = function (clubId, eventId) {
                        var eventQuery = EventsUsersRef.child(clubId).child(eventId).orderByChild("gender_sent").startAt("male_false").endAt("male_true");
                        array = $infiniteScrollPending(eventQuery, 15);
                        return array;
                    };

                    this.GetUsersInEventByFemale = function (clubId, eventId) {
                        var eventQuery = EventsUsersRef.child(clubId).child(eventId).orderByChild("gender_sent").startAt("female_false").endAt("female_true");
                        array = $infiniteScrollPending(eventQuery, 15);
                        return array;
                    };


                    this.GetApprovedUsersInEvent = function (clubId, eventId) {


                        var eventQuery = EventsUsersRef.child(clubId).child(eventId).orderByChild("group").startAt(1);
                        array = $infiniteScrollPending(eventQuery, 15);
                        return array;
                    };


                    this.checkUserRegisteredToEvent = function (clubesEvents,clubId,userId) {
                        var one = $q.defer();
                        var userExists = {};
                        var promises = [];
                        clubesEvents.forEach(function (event) {
                            var EventsUsersRef = firebase.database().ref('UsersInEvent/' + clubId + '/' + event.$id + '/' + userId);
                            var promise = EventsUsersRef.once('value').then(function (snapshot) {

                                if (snapshot.hasChild('approved')) {
                                    userExists[event.$id] = true;
                                } else
                                    userExists[event.$id] = false;
                            });
                            promises.push(promise);
                        });
                        $q.all(promises).then(function () {
                            one.resolve(userExists);
                        });
                        return one.promise;
                    };

                    this.GetOneEvent = function (clubId, EventKey) {
                        var clubRef = EventsRef.child(clubId).child(EventKey);
                        return $firebaseObject(clubRef);
                    };

                    this.getClubEvents = function (clubId) {
                        console.log('in event');
                        console.log(clubId);
                        var one = $q.defer();
                        var events = $firebaseArray(EventsRef.child(clubId));

                        events.$loaded().then(function () {
                            one.resolve(events);
                        });
                        // Avner remmber that you didn't handle errores in load userr object. For later add catch
                        return one.promise;
                    };

                    this.addUserToEvent = function (eventId, clubId, userObj, groupId) {
                        // need to add check if user already signed in 
                        var user = {
                            name: userObj.first_name + " " + userObj.last_name,
                            picture: userObj.picture,
                            gender: userObj.gender,
                            approved: false,
                            sent: false,
                            entered: false,
                            gender_sent: userObj.gender + "_" + false,
                            sent_group: false + "_" + groupId,
                            group: groupId
                        };
                        EventsUsersRef.child(clubId).child(eventId).child(userObj.$id).set(user);
//https://github.com/firebase/functions-samples/blob/master/child-count/functions/index.js
//add  function to make a counter
                    };

                }
                ;


            });
})(); 