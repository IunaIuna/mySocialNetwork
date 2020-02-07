import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriendsAndWannabes } from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    const friends = useSelector(
        state =>
            state.friends &&
            state.friends.filter(friend => friend.accepted == true)
    );

    useEffect(() => {
        console.log("component mounted");
        dispatch(receiveFriendsAndWannabes());
    }, []);

    if (!friends) {
        return null;
    }
    return (
        <div>
            {friends &&
                friends.map((friend, index) => {
                    return <h1 key={index}>{friend.first}</h1>;
                })}
        </div>
    );
}
