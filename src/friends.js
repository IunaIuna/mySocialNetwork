import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveFriendsAndWannabes,
    acceptFriendRequest,
    unfriend
} from "./actions";

export default function Friends() {
    const dispatch = useDispatch();

    const friends = useSelector(
        state =>
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter(friend => friend.accepted == true)
    );

    const wannabes = useSelector(
        state =>
            state.friendsAndWannabes &&
            state.friendsAndWannabes.filter(
                wannabe => wannabe.accepted == false
            )
    );

    useEffect(() => {
        console.log("component mounted");
        dispatch(receiveFriendsAndWannabes());
    }, []);

    if (!friends) {
        return null;
    }
    if (!wannabes) {
        return null;
    }

    //TWO ROWS FOR FRIENDS AND WANNABES
    return (
        <div>
            <div>
                <h1>Your friends</h1>
                {friends &&
                    friends.map((friend, index) => {
                        return (
                            <div key={index}>
                                <img src={friend.imageurl} />
                                {friend.first} {friend.last}
                                <button
                                    onClick={() =>
                                        dispatch(unfriend(friend.id))
                                    }
                                >
                                    Unfriend
                                </button>
                            </div>
                        );
                    })}
            </div>
            <div>
                <h1>People who want to be friends with you</h1>
                {wannabes &&
                    wannabes.map((wannabe, index) => {
                        return (
                            <div key={index}>
                                <img src={wannabe.imageurl} />
                                {wannabe.first} {wannabe.last}
                                <button
                                    onClick={() =>
                                        dispatch(
                                            acceptFriendRequest(wannabe.id)
                                        )
                                    }
                                >
                                    Accept friend request
                                </button>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}
