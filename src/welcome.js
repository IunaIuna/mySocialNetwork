import React from "react";
import Registration from "./registration";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";
import Reset from "./reset";
// import ResetSuccess from "./reset-success";

// http://localhost:8080/#/login

export default function Welcome() {
    return (
        <div>
            <img id="ape" src="monkey.svg" />

            <h1>Welcome</h1>
            <HashRouter>
                <Route exact path="/" component={Registration} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/reset" component={Reset} />
            </HashRouter>
        </div>
    );
}

// <Route exact path="/reset/success" component={ResetSuccess} />
// export default function Welcome() {
//     console.log("Hello");
//     return "hello";
// }
