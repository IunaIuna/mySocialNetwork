import React from "react";

export default function ProfilePic(props) {
    let imageUrl = props.imageUrl;
    if (imageUrl == null) {
        imageUrl = "default.png";
    }
    return (
        <div>
            <img
                className={props.className}
                onClick={props.clickProfilePic}
                src={imageUrl}
                alt={props.first + "" + props.last}
            />
        </div>
    );
}
