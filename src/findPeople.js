import React, { useState, useEffect } from "react";
import axiosCopy from "./axios";

export default function findPeople() {
    const [recentUsers, setRecentUsers] = useState([]);
    const [val, setVal] = useState("");
    const [users, setUsers] = useState([]);

    //[] needs to be empty, should load only once
    useEffect(() => {
        console.log("useEffect is running");
        axiosCopy.get("/users").then(({ data }) => {
            console.log("data in findPeople.js: ", data);
            setRecentUsers(data.rows);
        });
    }, []);

    useEffect(() => {
        setRecentUsers([]);
        if (val == "") {
            return;
        }

        axiosCopy.post("/search", { val: val }).then(({ data }) => {
            // if (!ignore) {
            setUsers(data.rows.rows);
            console.log("data from /search ", data);
            console.log("data.rows.rows", data.rows.rows);
            // }
        });
        //     return () => {
        //         console.log("clean up function", users);
        //         ignore = true;
        //     };
    }, [val]);
    //
    const onUserChange = ({ target }) => {
        // console.log("target.value", target.value);
        setVal(target.value);
    };

    return (
        <div>
            <div className="inputAreaFriendSearch">
                {recentUsers.length == 0 && (
                    <ul className="ulStyle">
                        {users.map(user => {
                            return (
                                <div key={user.id} className="latestUsers">
                                    <div>
                                        <li className="liFriends">
                                            <img
                                                className="recentUser"
                                                src={user.imageurl}
                                            />
                                            <br />
                                            <center>
                                                <a href={"../user/" + user.id}>
                                                    {user.first} {user.last}
                                                </a>
                                            </center>
                                            <br />
                                            <br />
                                        </li>
                                    </div>
                                </div>
                            );
                        })}
                    </ul>
                )}
                <div>
                    <h1>Latest users</h1>
                    <div className="">
                        <div className="boxAroundUl">
                            {recentUsers.length != 0 && (
                                <ul className="ulStyle">
                                    {recentUsers.map(recentUser => {
                                        return (
                                            <li
                                                className="liFriends"
                                                key={recentUser.id}
                                            >
                                                <img
                                                    className="recentUser"
                                                    src={recentUser.imageurl}
                                                />
                                                <br />
                                                <center>
                                                    <a
                                                        href={
                                                            "../user/" +
                                                            recentUser.id
                                                        }
                                                    >
                                                        {recentUser.first}{" "}
                                                        {recentUser.last}
                                                    </a>
                                                </center>
                                                <br />
                                                <br />
                                            </li>
                                        );
                                    })}
                                </ul>
                            )}
                        </div>
                    </div>
                </div>

                <div className="titleFriends1">
                    Are you looking for someone in particular?
                </div>
                <br />
                <input
                    className="inputFriendSearch"
                    onChange={onUserChange}
                    type="text"
                    placeholder="Enter name"
                />
            </div>
        </div>
    );
}

//der jettzt part is der  else part, darüber muss stehen: if (user == "") {
//axios.get ("u")
//}
