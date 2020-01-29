import React from "react";
import axiosCopy from "./axios";
import { Link } from "react-router-dom";

export default class ResetVerify extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        // this[e.target.name] = e.target.value;
        this.setState({
            [e.target.name]: e.target.value
        });
        console.log("this.state in handleChange - resetVerfiy", this.state);
    }
    submit() {
        console.log(
            "submit button/resetVerify was clicked and this state ",
            this.state
        );
        //axios.post('/register', this.state);
        axiosCopy
            .post("/reset/verify", {
                secret_code: this.state.secret_code
            })
            .then(({ data }) => {
                if (data.success) {
                    //it worked
                    location.replace("/reset/success");
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
                Please enter the code you received
                <br />
                <br />
                Please enter a new password
                <input
                    name="secret_code"
                    onChange={e => this.handleChange(e)}
                />
                <br />
                <br />
                <input
                    name="newPassword"
                    onChange={e => this.handleChange(e)}
                />
                <br />
                <br />
                <button onClick={() => this.submit()}>Submit</button>
                <br />
            </div>
        );
    }
}
