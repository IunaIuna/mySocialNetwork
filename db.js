const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/social_network"
);

exports.registerUser = function(first, last, email, password) {
    return db.query(
        "INSERT INTO users (first, last, email, password) VALUES ($1, $2, $3, $4) RETURNING id",
        [first, last, email, password]
    );
};

exports.getInfoByEmail = function(email) {
    return db.query("SELECT password, id FROM users WHERE email = $1", [email]);
};

exports.addUserForReset = function(email, secret_code) {
    console.log("email, secret_code in db.js", email, secret_code);
    return db.query(
        `INSERT INTO reset (email, secret_code) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET secret_code = $2, created_at = now() RETURNING id`,
        [email, secret_code]
    );
};

exports.pickSecretCodeByMail = function(email) {
    return db
        .query(
            "SELECT secret_code FROM reset WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' AND email = $1",
            [email]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.updatePassword = function(password, email) {
    return db.query("UPDATE users SET password = $1 WHERE email= $2", [
        password,
        email
    ]);
};

exports.getUserInfo = function(id) {
    return db
        .query("SELECT * FROM users WHERE id = $1", [id])
        .then(({ rows }) => {
            console.log("getUserInfo rows", rows);
            return rows;
        });
};

exports.updateProfilePic = function(id, imageUrl) {
    return db
        .query(
            "UPDATE users SET imageurl = $2 WHERE id = $1 RETURNING imageurl",
            [id, imageUrl]
        )
        .then(({ rows }) => {
            console.log("db.js - rows", rows[0].imageurl);
            return rows[0].imageurl;
        });
};

exports.updateBio = function(bio, id) {
    return db
        .query("UPDATE users SET bio = $1 WHERE id =$2 RETURNING bio", [
            bio,
            id
        ])
        .then(({ rows }) => {
            console.log("db.js updateBio - rows", rows);
            return rows;
        });
};

exports.getRecentUsers = function() {
    return db
        .query(
            "SELECT id, first, last, imageurl FROM users ORDER BY id DESC LIMIT 3"
        )
        .then(({ rows }) => {
            console.log("db.js updateBio - rows", rows);
            return rows;
        });
};

exports.findMatchingUser = function(val) {
    return db.query(
        "SELECT * FROM users WHERE first ILIKE $1 OR last ILIKE $1 OR CONCAT(first, ' ', last) ILIKE $1 ORDER BY id LIMIT 4",
        [val + "%"]
    );
};
////////FRIENDS//////////////////////////////////////////
exports.checkFriendsStatus = function(sender_id, recipient_id) {
    return db
        .query(
            `SELECT * FROM friendships
WHERE (recipient_id = $1 AND sender_id = $2)
OR (recipient_id = $2 AND sender_id = $1)`,
            [sender_id, recipient_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.makeFriendRequest = function(sender_id, recipient_id) {
    return db
        .query(
            `INSERT INTO friendships (sender_id, recipient_id) VALUES ($1, $2) RETURNING *`,
            [sender_id, recipient_id]
        )
        .then(({ rows }) => {
            return rows;
        });
};

exports.acceptFriendRequest = function(sender_id, recipient_id) {
    return db.query(
        `UPDATE friendships SET accepted = true WHERE (sender_id = $1 AND recipient_id = $2) OR (recipient_id = $1 AND sender_id = $2)`,
        [sender_id, recipient_id]
    );
};

exports.endFriendship = function(sender_id, recipient_id) {
    return db.query(
        `DELETE FROM friendships WHERE (recipient_id = $1 AND sender_id = $2) OR (recipient_id = $2 AND sender_id = $1)`,
        [sender_id, recipient_id]
    );
};

exports.receiveFriendsAndWannabes = function(val) {
    return db
        .query(
            `SELECT users.id, first, last, imageurl, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND recipient_id = users.id)`,
            [val]
        )
        .then(({ rows }) => {
            // console.log("in db.js: friendsWannabes", rows);
            // console.log("#################################");
            return rows;
        });
};

exports.insertChatMessages = function(sender_id, message) {
    return db
        .query(
            "INSERT INTO chatMessages (sender_id, message) VALUES ($1, $2) RETURNING *",
            [sender_id, message]
        )
        .then(({ rows }) => {
            console.log("sth was inserted");
            return rows;
        });
};

exports.getLastTenChatMessages = function() {
    return db
        .query(
            "SELECT first, last, imageUrl, sender_id, message FROM chatMessages JOIN users ON users.id = chatMessages.sender_id ORDER BY chatMessages.id DESC LIMIT 10"
        )
        .then(({ rows }) => {
            return rows;
        });
};
