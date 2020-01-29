import React from "react";
import axiosCopy from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        // this[e.target.name] = e.target.value;
        this.setState({
            [e.target.name]: e.target.value
        });
        console.log("this.state in handleChange", this.state);
    }
    submit() {
        console.log("submit button was clicked and this state ", this.state);
        //axios.post('/register', this.state);
        axiosCopy
            .post("/login", {
                email: this.state.email,
                password: this.state.password
            })
            .then(({ data }) => {
                if (data.success) {
                    console.log("login successful", data);
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
        return (
            <div>
                {this.state.error && <div className="error">Oops!</div>}
                <input
                    placeholder="email"
                    name="email"
                    onChange={e => this.handleChange(e)}
                />
                <br />
                <input
                    placeholder="password"
                    name="password"
                    type="password"
                    onChange={e => this.handleChange(e)}
                />
                <br />
                <br />
                <button onClick={() => this.submit()}>login</button>
                <br />
                <br />
                Not a member yet? <Link to="/">Register</Link>
                <br />
                Forgot your password? <Link to="/reset/start">Reset here</Link>
                <br />
            </div>
        );
    }
}
