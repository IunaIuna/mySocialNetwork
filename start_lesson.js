import React from "react";
import ReactDOM from "react-dom";
import Hello from "./hello";

console.log("hi!");

const elem = <Hello />;

ReactDOM.render(elem, document.querySelector("main"));
