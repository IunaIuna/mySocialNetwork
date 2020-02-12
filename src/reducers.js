console.log("reducers.js called");

export default function reducer(state = {}, action) {
    if (action.type === "RECEIVE_FRIENDS_WANNABES") {
        console.log("new state will be set");
        console.log("***********************");
        console.log(action.friends);
        state = {
            ...state,
            friendsAndWannabes: action.friendsAndWannabes
        };
        console.log("state for RECEIVE_FRIENS_WANNABES", state);
    } else if (action.type == "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friendsAndWannabes: state.friendsAndWannabes.map(user => {
                if (user.id != action.id) {
                    return user;
                } else {
                    return {
                        ...user,
                        accepted: true
                    };
                }
            })
        };
    } else if (action.type == "UNFRIEND") {
        state = {
            ...state,
            friendsAndWannabes: state.friendsAndWannabes.filter(
                user => user.id != action.id
            )
        };
    } else if (action.type == "LAST_TEN_MESSAGES") {
        console.log("LAST_TEN_MESSAGES = ", action);
        state = {
            ...state,
            chatMessages: action.chatMessages
        };
    } else if (action.type == "ONE_MESSAGE") {
        console.log("ONE_MESSAGE = ", action);
        state = {
            ...state,
            chatMessages: state.chatMessages.concat([action.oneMsg])
        };
    }
    return state;
}

//immutably
//map - good for changing items in an array
//filter - removes an item(s) from an array
//concat - combine two or more arrays into one array
//....(spread operator) - copy arrays and obejects and add properties to  those copies
//Object.assign - make copies of objects
//
