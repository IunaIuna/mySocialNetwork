import React from "react";
import axiosCopy from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        console.log("handleChange in uploader.js");
        this.setState({
            file: e.target.files[0]
        });
    }
    submit() {
        var formData = new FormData();
        formData.append("file", this.state.file);
        //console.log(formData) -> will give out an empty object
        var me = this;
        axiosCopy
            .post("/upload", formData)
            .then(function(res) {
                //if app.post(req.file) was successful: you will see it in the browser
                console.log("resp from POST /upload: ", res);
                //We named it "result" in the upload route
                me.props.setImageUrl(res.data.result);
            })
            .catch(function(err) {
                console.log("err in POST /upload: ", err);
            });
    }
    render() {
        return (
            <div>
                Hello! This is the uploader!
                <input
                    type="file"
                    name="file"
                    id="file"
                    onChange={e => this.handleChange(e)}
                    image="image/*"
                />
                <button onClick={e => this.submit()}>submit</button>
            </div>
        );
    }
}
