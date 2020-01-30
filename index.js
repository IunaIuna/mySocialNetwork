const express = require("express");
const app = express();
app.use(express.json());

const compression = require("compression");

const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");
const db = require("./db");
const csurf = require("csurf");
const ses = require("./ses");
// const s3 = require("./s3");
app.use(compression());

app.use(express.static("./public"));

// app.use(
//     require("cookie-sssion")({
//         secret: process.env.SESS_SECRET
//     })
// );

app.use(
    cookieSession({
        secret: "Three rabbits ran to the lobster.",
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);
//
app.use(csurf());

app.use(function(req, res, nect) {
    res.cookie("mytoken", req.csrfToken());
    nect();
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}
///////////////////////////////////////////////
app.get("/welcome", function(req, res) {
    console.log("GET request to /welcome happened");
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//REGISTER
app.post("/register", function(req, res) {
    console.log("POST request to /register happened");

    bcrypt
        .hash(req.body.password)
        .then(hashedPassword => {
            //PUTTING SIGN IN-INFO IN THE DATABASE
            return db.registerUser(
                req.body.first,
                req.body.last,
                req.body.email,
                hashedPassword
            );
        })
        .then(id => {
            //SETTING THE COOKIES, LOGIN
            console.log("ID = ", id);
            req.session.userId = id.rows[0].id;
            res.json({ success: true });
            //will redirect in registration.js
        })
        .catch(err => {
            console.log("error in registration", err);
            res.json({ success: false });
        });
});

//LOGIN
app.post("/login", (req, res) => {
    console.log("POST request to /login happened!");
    console.log("Mail: ", req.body.email);
    db.getInfoByEmail(req.body.email)
        .then(hashedPasswordAndIdFromDB => {
            console.log("hashedPasswordAndIdFromDB", hashedPasswordAndIdFromDB);

            if (typeof hashedPasswordAndIdFromDB.rows[0] === "undefined") {
                console.log("mail address does not exist");
                res.json({ success: false });
            } else {
                let hashedPassword = hashedPasswordAndIdFromDB.rows[0].password;
                // console.log("password: ", password);
                //compare() hashes automatically the typedin password
                bcrypt
                    .compare(req.body.password, hashedPassword)
                    .then(isPasswordMatching => {
                        console.log(isPasswordMatching);
                        if (isPasswordMatching) {
                            console.log(
                                "hashedPasswordAndIdFromDB***",
                                hashedPasswordAndIdFromDB
                            );
                            req.session.userId =
                                hashedPasswordAndIdFromDB.rows[0].id;
                            res.json({ success: true });
                        } else {
                            console.log("Password does not match");
                        }
                    })
                    .catch(err => console.log("err in bcrypt", err));
            }
        })
        .catch(err => {
            console.log("error in Password Retrieval", err);
            // res.json({ success: false });
        });
});

//RESET PASSWORD//////////////////////////

//PART1: reset-start
app.post("/reset/start", (req, res) => {
    //routes: verify that mail exists
    console.log("POST request to /reset happened");
    db.getInfoByEmail(req.body.email).then(result => {
        console.log("result of getInfoByMail -in resetStart", result.rows[0]);

        //if there is an id.....
        if (result.rows[0] != undefined) {
            const cryptoRandomString = require("crypto-random-string");
            const secret_Code = cryptoRandomString({
                length: 6
            });
            console.log("email exists");
            console.log("mail and code", req.body.email, secret_Code);
            db.addUserForReset(req.body.email, secret_Code);
            ses.sendEmail(
                "internal.gondola@spicedling.email",
                "We are sorry you are having trouble logging in. Your code for reset: " +
                    secret_Code,
                "Reset password"
            );
            res.json({ success: true });
        } else {
            console.log("Email doesn't exist");
        }
    });
});

//PART2: RESET-VERIFY
app.post("/reset/verify", (req, res) => {
    //routes: verify that mail exists
    console.log("req.body.email: ", req.body.email);
    console.log("POST request to /reset/verify happened");

    db.pickSecretCodeByMail(req.body.email).then(secret_code => {
        console.log(
            "result of pickSecretCodeByMail = secret_code ",
            secret_code
        );
        console.log(
            "compare secret_code",
            req.body.secret_code,
            secret_code[0].secret_code
        );
        if (req.body.secret_code === secret_code[0].secret_code) {
            console.log("passwords match");
            bcrypt.hash(req.body.newPassword).then(hashedPassword => {
                console.log("hashedPassword", hashedPassword);
                db.updatePassword(hashedPassword, req.body.email).then(() =>
                    res.json({ success: true })
                );
            });
        } else {
            console.log("The secret code is wrong.");
        }
    });
});

app.get("/user", function(req, res) {
    db.getUser().then(({ rows }) => {
        res.json({
            first: rows[0].first,
            imageUrl: rows[0].image || "default.jpg"
        });
    });
});
// ////////////////////////////////////
app.get("*", function(req, res) {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        //youre logged in
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function() {
    console.log("I'm listening on port 8080");
});
