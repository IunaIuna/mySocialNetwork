import React from "react";
import axiosCopy from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        // this[e.target.name] = e.target.value;
        this.setState({
            [e.target.name]: e.target.value
        });
        console.log("this.state in handleChange - registration", this.state);
    }
    submit() {
        console.log(
            "submit button/Registration was clicked and this state ",
            this.state
        );
        //axios.post('/register', this.state);
        axiosCopy
            .post(
                "/register",
                {
                    first: this.state.first,
                    last: this.state.last,
                    email: this.state.email,
                    password: this.state.password
                }
                // {
                //     xsrfCookieName: "myToken",
                //     xsrfHeaderName: "csrf-token"
                //     // the csurf middleware
                // }
            )
            .then(({ data }) => {
                if (data.success) {
                    //it worked
                    location.replace("/");
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
        //otherwise: It will show na error
        console.log("this input form");
        return (
            <div>
                {this.state.error && <div className="error">Oops!</div>}
                <input name="first" onChange={e => this.handleChange(e)} />
                <br />
                <input name="last" onChange={e => this.handleChange(e)} />
                <br />
                <input name="email" onChange={e => this.handleChange(e)} />
                <br />
                <input
                    name="password"
                    type="password"
                    onChange={e => this.handleChange(e)}
                />
                <br /> <br />
                <button onClick={() => this.submit()}>register</button>
                <br />
                <br />
                Already a member? <Link to="/login">Log in</Link>
            </div>
        );
    }
}
