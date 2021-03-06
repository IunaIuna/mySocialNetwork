import React, { useEffect, useRef } from "react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";

export function Chat() {
    const chatMessages = useSelector(state => state && state.chatMessages);
    console.log("chatMessages: ", chatMessages);

    const onlineUsers = useSelector(state => state && state.onlineUsers);
    console.log("onlineUsers: ", onlineUsers);

    const elemRef = useRef();

    useEffect(() => {
        console.log("chat mounted");
        console.log("elemRef", elemRef);
        let { clientHeight, scrollTop, scrollHeight } = elemRef.current;
        console.log("scroll top, ", scrollTop);
        console.log("client height, ", clientHeight);
        console.log("scroll height, ", scrollHeight);
        elemRef.current.scrollTop = scrollHeight - clientHeight;
    }, [chatMessages, onlineUsers]);

    const keyCheck = e => {
        if (e.key === "Enter") {
            e.preventDefault(); //stops the annoying moving to a new line
            console.log("what the user is typing: ", e.target.value);
            console.log("which key user pressed: ", e.key);
            socket.emit("addSingleMessage", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div id="boxAroundChat">
            <center>
                <div className="title">
                    Talk with people about your work, passions & dreams
                </div>
            </center>
            <div className="chatAndOnline">
                <div className="chatAndTextarea">
                    <div className="chat">
                        <div className="chat-container" ref={elemRef}>
                            {chatMessages &&
                                chatMessages.map((msg, index) => {
                                    const timestamp = msg.created_at.split(
                                        /[- T :]/
                                    );
                                    const time =
                                        timestamp[0] +
                                        "-" +
                                        timestamp[1] +
                                        "-" +
                                        timestamp[2] +
                                        " " +
                                        timestamp[3] +
                                        ":" +
                                        timestamp[4];
                                    return (
                                        <div key={index} className="chatter">
                                            <div className="friend-userpic-container">
                                                <img
                                                    className="chat-userpic"
                                                    src={msg.imageurl}
                                                />
                                            </div>
                                            <div className="chatText">
                                                <div className="chatHeader">
                                                    <div className="chatName">
                                                        {msg.first} {msg.last}
                                                    </div>
                                                    <div className="timestamp">
                                                        {time}
                                                    </div>
                                                </div>

                                                <div className="message">
                                                    <p>{msg.message}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                        </div>
                        <div id="textarea">
                            <textarea
                                className="textarea"
                                placeholder="Add your message here"
                                onKeyDown={keyCheck}
                            ></textarea>
                        </div>
                    </div>
                </div>
                <div className="onlineUser-container">
                    {onlineUsers &&
                        onlineUsers.map((users, index) => {
                            return (
                                <div key={index} className="onlineUser">
                                    <div className="friend-userpic-container">
                                        <center>
                                            <img
                                                className="chat-userpic"
                                                src={users.imageurl}
                                            />
                                            <h4 className="chatName">
                                                {users.first} {users.last}
                                            </h4>
                                        </center>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}
