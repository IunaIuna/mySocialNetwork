import React, { useState, useEffect } from "react";
import axiosCopy from "./axios";

export default function friendButton(props) {
    const [buttonText, setButtonText] = useState("");

    useEffect(() => {
        if (props.otherUserId) {
            axiosCopy
                .get("/friends-status/" + props.otherUserId)
                .then(({ data }) => {
                    console.log(
                        "data.rows[0] in friendButton.js",
                        data.rows[0]
                    );
                    console.log("data", data);

                    if (data.rows.length === 0) {
                        console.log("no relationsship yet");
                        setButtonText("Make friend request");
                        console.log("buttonText fufu", buttonText);
                    } else if (data.rows[0].accepted == false) {
                        if (data.rows[0].recipient_id == props.otherUserId) {
                            setButtonText("Cancel friend request");
                            console.log("buttonText 3 ", buttonText);
                        } else if (
                            data.rows[0].sender_id == props.otherUserId
                        ) {
                            setButtonText("Accept friend request");
                        }
                    } else {
                        setButtonText("Unfriend");
                        console.log("buttonText that ", buttonText);
                    }
                })
                .catch(err => {
                    console.log(err);
                });
        }
    }, [buttonText]);

    // console.log("buttonText this", buttonText);

    ////HANDLECLICK//////
    const handleClick = () => {
        console.log("otherUserId", props.otherUserId);
        if (buttonText == "Make friend request") {
            axiosCopy
                .post("/make-friend-request/" + props.otherUserId)
                .then(({ data }) => {
                    console.log("data from make-friend-request", data);

                    if (data.rows[0].recipient_id == props.otherUserId) {
                        setButtonText("Accept friend request");
                    } else if (data.rows[0].sender_id == props.id) {
                        setButtonText("Cancel friend request");
                    }
                });
        }

        if (buttonText == "Accept friend request") {
            axiosCopy
                .post("/accept-friend-request/" + props.otherUserId)
                .then(({ data }) => {
                    console.log("data from /accept-friend-request/", data);
                    if (data.success) {
                        setButtonText("Unfriend");
                    }
                });
        }
    };
    // if (buttonText == "Cancel friend request" || "Unfriend") {
    //     axiosCopy
    //         .post("/end-friendship/" + props.otherUserId)
    //         .then(({ data }) => {
    //             console.log("data from /end-friendship/", data);
    //             if (data.success) {
    //                 setButtonText("Make friend request");
    //             }
    //         });
    // }

    return (
        <div>
            <button onClick={handleClick}>{buttonText}</button>
        </div>
    );
}
