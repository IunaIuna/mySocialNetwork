//actions.js is just a bunch of functions
import axiosCopy from "./axios";

//axios request to server
//ALL action creators will return objects that have a type property
export async function receiveFriendsAndWannabes() {
    const { data } = await axiosCopy.get("/friends-wannabes");
    console.log("data from /friends-wannabes", data);
    return {
        type: "RECEIVE_FRIENDS_WANNABES",
        friendsAndWannabes: data.rows
    };
}

export async function acceptFriendRequest(id) {
    console.log("acceptFriendRequest");
    await axiosCopy.post("/accept-friend-request/" + id);
    return {
        type: "ACCEPT_FRIEND_REQUEST",
        id
    };
}

export async function unfriend(id) {
    console.log("req unfriend");
    await axiosCopy.post("/end-friendship/" + id);
    return {
        type: "UNFRIEND",
        id
    };
}
