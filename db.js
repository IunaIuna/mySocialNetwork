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
    return db.query("SELECT * FROM users WHERE id = $1", [id]);
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
