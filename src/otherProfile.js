import React from "react";
import axiosCopy from "./axios";
import FriendButton from "./friendButton";

export default class OtherProfile extends React.Component {
    constructor() {
        super();
        this.state = {};
    }

    componentDidMount() {
        //here we want to make a request to the server to get all the info about the requested user
        console.log("this.props.match.params.id ", this.props.match.params.id);
        //we want the server to send back all info about the request user
        //AND the id of the currently logged in user...
        //IF these are the same... we need to redirect them back to the /

        //this is a hard coded DEMO
        if (this.props.match.params.id == 1) {
            //we want to redirect them
            this.props.history.push("/");
        }
        //we also want to redirect if the user doesnt exist.....

        axiosCopy
            .get("/api/user/" + this.props.match.params.id)
            .then(({ data }) => {
                console.log("res from axios POST /api/user/  ", data);
                // console.log("data.currentId ", data.currentId);
                if (this.props.match.params.id == data.currentId) {
                    //     //we want to redirect them
                    this.props.history.push("/");
                } else {
                    this.setState(data);
                    console.log("this.state", this.state);
                }
            });
    }

    render() {
        if (!this.state.id) {
            return <img src="progressbar.gif" alt="Loading..." />;
        }

        return (
            <div>
                {this.state.first} {this.state.last}
                <br />
                <img src={this.state.imageUrl} />
                <p>{this.state.bio}</p>
                <FriendButton otherUserId={this.state.id} />
            </div>
        );
    }
}
// {!this.state.userInfo.id && <div>The user does not exist</div>}
