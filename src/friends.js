import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
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
                                <Link
                                    to={`/user/${friend.id}`}
                                    className="nav-link"
                                >
                                    {friend.first} {friend.last}
                                </Link>
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
                                <Link
                                    to={`/user/${wannabe.id}`}
                                    className="nav-link"
                                >
                                    {wannabe.first} {wannabe.last}
                                </Link>
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
