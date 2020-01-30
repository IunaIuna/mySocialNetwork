import React from "react";
import ReactDOM from "react-dom";
import Welcome from "./welcome";

console.log("start.js");
// checking if user logged in
let elem;
if (location.pathname == "/welcome") {
    elem = <Welcome />;
} else {
    elem = <img id="ape" src="monkey.svg" />;
}
ReactDOM.render(elem, document.querySelector("main"));
