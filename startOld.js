import React from "react";
import ReactDOM from "react-dom";
import hello from "hello";
console.log("hi!");

const elem = <Hello name="Dalai" />;

ReactDOM.render(elem, document.querySelector("main"));

function Greetee(props) {
    console.log("props", props);
    const greetee = props.name;
    const elem = <span className={greetee}>{greetee}</span>;
    return elem;
}
