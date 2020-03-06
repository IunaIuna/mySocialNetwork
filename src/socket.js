import { tenLastMessages, addSingleMessage, onlineUsers } from "./actions";
import * as io from "socket.io-client";

export let socket;

export const init = store => {
    if (!socket) {
        socket = io.connect();

        socket.on("addSingleMessage", msg =>
            store.dispatch(addSingleMessage(msg))
        );

        socket.on("tenLastMessages", msgs =>
            store.dispatch(tenLastMessages(msgs.data))
        );

        socket.on("onlineUsers", resp => {
            store.dispatch(onlineUsers(resp));
            console.log("onlineUser in socket.js", resp);
        });
    }
};
