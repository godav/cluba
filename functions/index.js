
// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');
// The Firebase Admin SDK to access the Firebase Realtime Database. 
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
// update the pending counter in event for all + male + female when user is signed in to event
exports.user_registered_to_event = functions.database.ref('/UsersInEvent/{clubId}/{eventId}/{userId}').onCreate(event => {
    const root = event.data.ref.root;
    const events = root.child('events').child(event.params.clubId).child(event.params.eventId).child('pending').child('all');
    return events.transaction(current => {
        return (current || 0) + 1;
    }).then(() => {
        var original = event.data.val();
        var gender = null;
        if (original.gender === "male") {
            gender = root.child('events').child(event.params.clubId).child(event.params.eventId).child('pending').child('male');
        } else if (original.gender === "female") {
            gender = root.child('events').child(event.params.clubId).child(event.params.eventId).child('pending').child('female');
        }
        return gender.transaction(current => {
            return (current || 0) + 1;
        });
    });
});
// update the pending counter in event for all + male + female when user is unsigned from event
exports.user_unregistered_to_event = functions.database.ref('/UsersInEvent/{clubId}/{eventId}/{userId}').onDelete(event => {
    const root = event.data.ref.root;
    const events = root.child('events').child(event.params.clubId).child(event.params.eventId).child('pending').child('all');
    return events.transaction(current => {
        return (current || 0) - 1;
    }).then(() => {
        var original = event.data.previous.val();
        const gender = root.child('events').child(event.params.clubId).child(event.params.eventId).child('pending').child(original.gender);
        return gender.transaction(current => {
            return (current || 0) - 1;
        });
    });
});
// update the approved counter in event for all + male + female when user has been approved to participate in event
exports.user_approved_to_event = functions.database.ref('/UsersInEvent/{clubId}/{eventId}/{userId}/sent').onUpdate(event => {

    const newVal = event.data.val();
    if (!newVal)
        return null;
    const root = event.data.ref.root;
    var original = root.child('UsersInEvent').child(event.params.clubId).child(event.params.eventId).child(event.params.userId);
    const events = root.child('events').child(event.params.clubId).child(event.params.eventId).child('approved').child('all');
    return events.transaction(current => {
        return (current || 0) + 1;
    }).then(() => {
        original.once("value", function (snapshot) {

            var user = snapshot.val();
            const gender = root.child('events').child(event.params.clubId).child(event.params.eventId).child('approved').child(user.gender);
            return gender.transaction(current => {
                return (current || 0) + 1;
            });
        });
    });
});
// update the entered counter in event for all + male + female when user has been entered to event
exports.user_entered_to_event = functions.database.ref('/UsersInEvent/{clubId}/{eventId}/{userId}/entered').onUpdate(event => {

    const newVal = event.data.val();
    if (!newVal)
        return null;
    const root = event.data.ref.root;
    var original = root.child('UsersInEvent').child(event.params.clubId).child(event.params.eventId).child(event.params.userId);
    const events = root.child('events').child(event.params.clubId).child(event.params.eventId).child('entered').child('all');
    return events.transaction(current => {
        return (current || 0) + 1;
    }).then(() => {
        original.once("value", function (snapshot) {

            var user = snapshot.val();
            const gender = root.child('events').child(event.params.clubId).child(event.params.eventId).child('entered').child(user.gender);
            return gender.transaction(current => {
                return (current || 0) + 1;
            });
        });
    });
});
// https://github.com/firebase/functions-samples/blob/master/fcm-notifications/functions/index.js


/**
 * Triggers when a user gets a new follower and sends a notification.
 *
 * Followers add a flag to `/followers/{followedUid}/{followerUid}`.
 * Users save their device notification tokens to `/users/{followedUid}/notificationTokens/{notificationToken}`.
 */
exports.sendFriendshipRequest = functions.database.ref('/friends/{userId}/{friendId}').onCreate(event => {

    const friendId = event.params.friendId;
    const userId = event.params.userId;
    // If un-follow we exit the function.
    if (!event.data.val()) {
        return console.log('User ', friendId, 'un-followed user', userId);
    }

    // Get device notification token.
    const getDeviceTokenPromise = admin.database().ref(`/users/${friendId}/token`).once('value');
    // Get the follower profile.
    const getUserRequestFriendshipPromise = admin.auth().getUser(userId);
    const getFriendPromise = admin.auth().getUser(friendId);
    return Promise.all([getDeviceTokenPromise, getUserRequestFriendshipPromise, getFriendPromise]).then((results) => {
        const tokenSnapshot = results[0];
        const UserRequestFriendship = results[1];

        // Notification details.
        const payload = {
            token: tokenSnapshot.val(),
            notification: {
                title: 'בקשת חברות חדשה ב - Clubears',
                body: ` ${UserRequestFriendship.displayName} - יש לך בקשת חברות חדשה מ `
            }
        };

        return [admin.messaging().send(payload), results[2], UserRequestFriendship];

    }).then((response) => {

        return admin.database().ref('/notifications/' + response[1].uid).push({UserRequestId: response[2].uid, UserRequestName: response[2].displayName, type: '1', active: true});

    }).catch((error) => {
        console.log('Error sending message:', error);

    });
});
        