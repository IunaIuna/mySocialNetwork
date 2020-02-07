//MEMBER AREA: After the login
import React from "react";
import axiosCopy from "./axios";
import { BrowserRouter, Route } from "react-router-dom";
import Profile from "./profile";
import Uploader from "./uploader";
import OtherProfile from "./otherProfile";
import FindPeople from "./findPeople";

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
                <img id="ape" src="/monkey.svg" alt="Logo" />
                <BrowserRouter>
                    <div>
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

                    <Route
                        path="/user/:id"
                        render={props => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                            />
                        )}
                    />
                    <Route path="/findPeople" component={FindPeople} />
                    <Route
                        exact
                        path="/"
                        render={props => (
                            <Profile
                                clickProfile={() =>
                                    this.setState({
                                        uploaderIsVisible: true
                                    })
                                }
                                imageUrl={this.state.imageUrl}
                                first={this.state.first}
                                last={this.state.last}
                                bioText={this.state.bio}
                                setBio={bioText =>
                                    this.setState({ bio: bioText })
                                }
                            />
                        )}
                    />
                </BrowserRouter>
            </div>
        );
    }
}

//this.state.first -> In profile: it is props.first*/

// Only App can change Apps state, so we need to write a function for Upload in order to change its state. So ProfilePic can call the function that APP can execute
