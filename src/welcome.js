import React from "react";
import Registration from "./registration";
import Login from "./login";
import { HashRouter, Route } from "react-router-dom";
import ResetStart from "./reset-start";
import ResetVerify from "./reset-verify";
import ResetSuccess from "./reset-success";

// export default function Welcome() {
//     console.log("Hello");
//     return "hello";
// }

// http://localhost:8080/#/login

export default function Welcome() {
    return (
        <div>
            <img id="ape" src="monkey.svg" />

            <h1>Welcome</h1>
            <HashRouter>
                <Route exact path="/" component={Registration} />
                <Route exact path="/login" component={Login} />
                <Route exact path="/reset/start" component={ResetStart} />
                <Route exact path="/reset/verfiy" component={ResetVerify} />
            </HashRouter>
        </div>
    );
}

// <Route exact path="/reset/success" component={ResetSuccess} />
