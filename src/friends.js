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
                <h1 className="titleFriends">Your friends</h1>
                <div className="boxAroundFriends">
                    {friends &&
                        friends.map((friend, index) => {
                            return (
                                <div className="friend-card" key={index}>
                                    <img
                                        className="friendsAndWannabes"
                                        src={friend.imageurl}
                                    />
                                    <br />
                                    <Link
                                        to={`/user/${friend.id}`}
                                        className="friends"
                                    >
                                        {friend.first} {friend.last}
                                    </Link>
                                    <br />
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
            </div>
            <div>
                <h1 className="titleFriends">
                    People who want to be friends with you
                </h1>
                <div className="boxAroundFriends">
                    {wannabes &&
                        wannabes.map((wannabe, index) => {
                            return (
                                <div className="friend-card" key={index}>
                                    <img
                                        className="friendsAndWannabes"
                                        src={wannabe.imageurl}
                                    />
                                    <br />
                                    <Link
                                        to={`/user/${wannabe.id}`}
                                        className="nav-link"
                                    >
                                        {wannabe.first} {wannabe.last}
                                    </Link>
                                    <br />
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
        </div>
    );
}
