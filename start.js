import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";

//The server can check out the url and see this way, if the user is logged in. If the user is logged out, she was redirected to the welcome page

let elem;
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    elem = <img src="/logo.gif" />;
}

ReactDOM.render(elem, document.querySelector("main"));
