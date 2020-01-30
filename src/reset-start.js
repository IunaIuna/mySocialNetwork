import React from "react";
import axiosCopy from "./axios";
import { Link } from "react-router-dom";
import ResetVerify from "./reset-verify";

export default class ResetStart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        // this[e.target.name] = e.target.value;
        this.setState({
            [e.target.name]: e.target.value
        });
        console.log("this.state in handleChange - resetStart", this.state);
    }
    submit() {
        console.log(
            "submit button/resetStart was clicked and this state ",
            this.state
        );
        //axios.post('/register', this.state);
        axiosCopy
            .post("/reset/start", {
                email: this.state.email
            })
            .then(({ data }) => {
                if (data.success) {
                    //it worked
                    console.log("it worked - resetStart");
                } else {
                    //failure!
                    this.setState({
                        error: true
                    });
                }
            });
    }
    render() {
        //I want to show this div when this.state.error is true
        //this.state.error => undefined
        //otherwise: It will show an error
        return (
            <div>
                {this.state.error && <div className="error">Oops!</div>}
                <h1>Reset Password</h1>
                Please enter the email address with which you have registered
                <br />
                <br />
                <input
                    name="email"
                    placeholder="email"
                    onChange={e => this.handleChange(e)}
                />
                <br />
                <br />
                <Link to="/reset/verify">
                    <button onClick={() => this.submit()}>Submit</button>
                </Link>
                <br />
            </div>
        );
    }
}
