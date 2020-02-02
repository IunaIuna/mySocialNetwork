import React from "react";
import axiosCopy from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isInEditingMode: false
        };
    }
    submit() {
        var me = this;
        var bioText = document.getElementById("textarea").value;
        var bioTextJSON = { bioText: bioText };
        axiosCopy
            .post("/save-bio", bioTextJSON)
            .then(function(res) {
                console.log("res from POST /save-bio: ", res.data.rows[0].bio);
                me.setState({
                    isInEditingMode: false,
                    bioText: res.data.rows[0].bio
                });
                me.props.setBio(res.data.rows[0].bio);
            })
            .catch(function(err) {
                console.log("err in POST /save-bio: ", err);
            });
    }

    render() {
        if (this.state.isInEditingMode == false) {
            if (this.props.bioText == null) {
                return (
                    <div>
                        <a
                            href="#"
                            onClick={() =>
                                this.setState({ isInEditingMode: true })
                            }
                        >
                            Add your bio now
                        </a>
                    </div>
                );
            } else {
                //has Bio and no editingmode
                return (
                    <div>
                        {this.props.bioText}
                        <br />
                        <a
                            href="#"
                            onClick={() =>
                                this.setState({ isInEditingMode: true })
                            }
                        >
                            Edit
                        </a>
                    </div>
                );
            }
        } else {
            return (
                <form>
                    <textarea id="textarea">{this.props.bioText}</textarea>
                    <br />
                    <button onClick={() => this.submit()}>Save</button>
                </form>
            );
        }
    }
}
