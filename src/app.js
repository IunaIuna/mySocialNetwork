import React from "react";
import axios from "./axios";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios.get("/user").then(({ data }) => this.setState(data));
    }
    render() {
        if (!this.state.id) {
            return <img src="progressbar.gif" alt="Loading..." />;
        }
        return (
            <div>
                <img src="/logo.gif" alt="Logo" />
                <ProfilePic
                    clickHandler={() =>
                        this.setState({ uploaderIsVisible: true })
                    }
                    imageUrl={this.state.imageUrl}
                    first={this.state.first}
                    last={this.state.last}
                />
                {this.state.uploaderIsVisible && (
                    <Uploader
                        setImageUrl={imageUrl => this.setState({ imageUrl })}
                    />
                )}
            </div>
        );
    }
}

// Only App can change Apps state, so we need to write a function for Upload in order to change its state. So ProfilePic can call the function that APP can execute
