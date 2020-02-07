console.log("reducers.js called");

export default function reducer(state = {}, action) {
    if (action.type === "RECEIVE_FRIENDS_WANNABES") {
        console.log("new state will be set");
        console.log("***********************");
        console.log(action.friends);
        state = {
            ...state,
            friends: action.friends
        };
        // } else if (action.type == "ACCEPT_FRIEND_REQUEST") {
        //     state = {
        //         ...state,
        //         friendsWannabes: "yoo"
        //     };
        // } else if (action.type == "UNFRIEND") {
        //     state = {
        //         ...state,
        //         friendsWannabes: "yoo"
        //     };
        // }
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
