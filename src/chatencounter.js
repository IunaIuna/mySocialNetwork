import React, { useEffect, useRef } from "react";
import { socket } from "./socket.js";
import { useSelector } from "react-redux";

export function Chat() {
    const chatMessages = useSelector(state => state && state.chatMessages);
    console.log("chatMessages: ", chatMessages);
    // const chatMessage = useSelector(state => state && state.chatMessage);
    // console.log("chatMessage: ", chatMessage);

    const elemRef = useRef();

    useEffect(() => {
        console.log("chat mounted");
        console.log("elemRef", elemRef);
        let { clientHeight, scrollTop, scrollHeight } = elemRef.current;
        console.log("scroll top, ", scrollTop);
        console.log("client height, ", clientHeight);
        console.log("scroll height, ", scrollHeight);
        elemRef.current.scrollTop = scrollHeight - clientHeight;
    }, [chatMessages]);

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
        <div className="chat">
            <h1>Chat room</h1>
            <div className="chat-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map((msg, index) => {
                        return (
                            <div key={index} className="friend">
                                <div className="friend-userpic-container">
                                    <img
                                        className="friend-userpic"
                                        src={msg.imageurl}
                                    />
                                </div>
                                <h4>
                                    {msg.first} {msg.last}
                                </h4>
                                <div className="message">{msg.message}</div>
                            </div>
                        );
                    })}
            </div>
            <textarea
                placeholder="Add your message here"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );

    // return (
    //   <div className="chat">
    //     <h1> Chat room! </h1>
    //     <div className="chat-container" ref={elemRef}>
    //     <h1>CHAT ROOM</h1>
    //       <div className="chat-container">
    //       {chatMessages &&
    //         chatMessages.map((msg, index) => {
    //           return (
    //             <div key={index} className="friend">
    //             <div className="friend-userpic-container">
    //             <img
    //             className="friend-userpic"
    //             src={msg.imageurl}
    //             />
    //             </div>
    //             <h4>
    //             {msg.first} {msg.last}
    //             </h4>
    //             <div className="message">{msg.message}</div>
    //             </div>
    //           );
    //         })}
    //       </div>
    //     <textarea
    //     placeholder="Add your message here"
    //     onKeyDown={keyCheck}
    //     ></textarea>
    //     </div>
    // );
}
