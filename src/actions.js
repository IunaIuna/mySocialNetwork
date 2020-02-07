//actions.js is just a bunch of functions
import axiosCopy from "./axios";

//axios request to server
//ALL action creators will return objects that have a type property
export async function receiveFriendsAndWannabes() {
    const { data } = await axiosCopy.get("/friends-wannabes");
    console.log("data from /friends-wannabes", data);
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friends: data.rows
    };
}

// export function acceptFriendRequest(users.id) {
//     axiosCopy.post("/accept-friend-request/" + users.id).then(({ data }) => {
//         console.log("actions: data from /acceptFriendRequest", data);
//         return {
//             type: "ACCEPT_FRIEND_REQUEST",
//             friends: data.rows
//         };
//     });
// }
//
// export function unfriend(users.id) {
//     axiosCopy.post("/end-friendship/" + users.id).then(({ data }) => {
//         console.log("actions: data from /end-friendship", data);
//         return {
//             type: "RECEIVE_FRIENDS_WANNABES",
//             users: data.rows
//         };
//     });
// }
