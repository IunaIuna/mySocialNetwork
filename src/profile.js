import React from "react";
import ProfilePic from "./profilePic";
import BioEditor from "./bioEditor";

export default function Profile(props) {
    console.log("profile.js here, hello");

    return (
        <div>
            <div>
                {props.first} {props.last}
            </div>
            <ProfilePic
                className="bigProfilePic"
                imageUrl={props.imageUrl}
                first={props.first}
                last={props.last}
            />
            <BioEditor bioText={props.bioText} setBio={props.setBio} />
        </div>
    );
}

//props.first: kommt von app.js this.state.first
