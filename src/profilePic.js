import React from "react";

export default function ProfilePic(props) {
    let imageUrl = props.imageUrl;
    if (imageUrl == null) {
        imageUrl = "default.png";
    }
    return (
        <div className="float">
            <img
                className="profilePic"
                onClick={props.clickHandler}
                src={imageUrl}
                alt={props.first + "" + props.last}
            />
        </div>
    );
}
