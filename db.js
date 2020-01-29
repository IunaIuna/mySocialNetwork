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
    // .then(pass => {
    //     return pass.rows[0];
    // });
};

exports.addUserForReset = function(email, secret_code) {
    return db.query("INSERT INTO reset (email, secret_code) VALUES ($1, $2)", [
        email,
        secret_code
    ]);
};

exports.checkSecretCode = function(secretCode) {
    return db.query(
        "SELECT secret_code FROM reset WHERE CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes' AND secret_code = $1",
        [secretCode]
    );
};
