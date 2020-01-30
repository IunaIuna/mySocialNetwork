import React from "react";
import axiosCopy from "./axios";
import { Link } from "react-router-dom";

export default class Reset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: 1,
            email: "",
            newPassword: "",
            secretCode: ""
        };
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
        console.log("this in handlechange -reset", this);
    }

    submit() {
        console.log("submit in reset.js");
        console.log("this.state.email", this.state.email);
        axiosCopy
            .post("/reset/start", {
                email: this.state.email
            })
            .then(({ data }) => {
                this.setState({ step: 2 });
            });
    }

    submitVerify() {
        console.log("submitVerify in reset.js");
        axiosCopy
            .post("/reset/verify", {
                secret_code: this.state.secret_code,
                newPassword: this.state.newPassword,
                email: this.state.email
            })
            .then(({ data }) => {
                console.log("data body", data);
                this.setState({ step: 3 });
            });
    }

    render() {
        //I want to show this div when this.state.error is true
        //this.state.error => undefined
        //otherwise: It will show an error
        if (this.state.step === 1) {
            return (
                <div>
                    {this.state.error && <div className="error">Oops!</div>}
                    <h1>Reset Password</h1>
                    Please enter the email address with which you have
                    registered
                    <br />
                    <br />
                    <input
                        name="email"
                        placeholder="email"
                        onChange={e => this.handleChange(e)}
                    />
                    <br />
                    <br />
                    <button onClick={() => this.submit()}>Submit</button>
                    <br />
                </div>
            );
        }

        if (this.state.step === 2) {
            return (
                <div>
                    {this.state.error && <div className="error">Oops!</div>}
                    <h1>Reset Password</h1>
                    <p>Please enter the code you received</p>
                    <input
                        name="secret_code"
                        onChange={e => this.handleChange(e)}
                    />
                    <br />
                    <br />
                    <p>Please enter a new password</p>
                    <input
                        name="newPassword"
                        onChange={e => this.handleChange(e)}
                    />
                    <br />
                    <br />
                    <button onClick={() => this.submitVerify()}>Submit</button>
                    <br />
                </div>
            );
        }

        if (this.state.step === 3) {
            return (
                <div>
                    Yay! You have got a new password! You can log in now!
                    <br />
                    <Link to="/login">Log in</Link>
                </div>
            );
        }
    }
}
