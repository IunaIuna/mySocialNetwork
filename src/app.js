//MEMBER AREA: After the login
import React from "react";
import axiosCopy from "./axios";
import Profile from "./profile";
import Uploader from "./uploader";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axiosCopy.get("/user").then(({ data }) => {
            console.log("data from app-setState", data);
            this.setState(data);
        });
    }
    //As long as it is loading and there is no id found yet, show: "Loading"
    render() {
        if (!this.state.id) {
            return <img src="progressbar.gif" alt="Loading..." />;
        }
        return (
            <div>
                <img id="ape" src="monkey.svg" alt="Logo" />
                <Profile
                    clickProfile={() =>
                        this.setState({ uploaderIsVisible: true })
                    }
                    imageUrl={this.state.imageUrl}
                    first={this.state.first}
                    last={this.state.last}
                    bioText={this.state.bio}
                    setBio={bioText => this.setState({ bio: bioText })}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        setImageUrl={imageUrl =>
                            this.setState({
                                imageUrl: imageUrl,
                                uploaderIsVisible: false
                            })
                        }
                    />
                )}
            </div>
        );
    }
}

//this.state.first -> In profile: it is props.first*/

// Only App can change Apps state, so we need to write a function for Upload in order to change its state. So ProfilePic can call the function that APP can execute
