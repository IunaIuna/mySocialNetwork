const express = require("express");
const app = express();
app.use(express.json());

const compression = require("compression");

const cookieSession = require("cookie-session");
const bcrypt = require("./bcrypt");
const db = require("./db");
const csurf = require("csurf");
const ses = require("./ses");
const aws = require("aws-sdk");
const s3 = require("./s3");
const { s3Url } = require("./config");

app.use(express.static("./public"));

app.use(express.json());
app.use(compression());

///////BOILERPLATE CODE FOR IMAGE UPLOAD///////////////

// npm packages (core modules):
//multer: stores the data
//uidSafe: creates a random name of 24 characters long
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
/////////////////////////////////////////////////////////

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
    console.log("GET request to /user happened");
    db.getUserInfo(req.session.userId).then(rows => {
        console.log("rows from getUserInfo: ", rows);
        res.json({
            first: rows[0].first,
            last: rows[0].last,
            id: rows[0].id,
            imageUrl: rows[0].imageurl,
            bio: rows[0].bio
        });
    });
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    console.log("POST request to /upload happened");
    console.log("file: ", req.file);
    console.log("input: ", req.body);

    if (req.file) {
        const imageUrl = s3Url + req.file.filename;
        console.log("imageUrl: ", imageUrl);
        db.updateProfilePic(req.session.userId, imageUrl).then(result => {
            console.log("ImageURL: WHAT IS IT?", result);
            res.json({ result: result });
        });
    } else {
        res.sendStatus(500);
        res.json({
            success: false
        });
    }
});

app.post("/save-bio", function(req, res) {
    console.log("POST request to /save-bio happened", req.body);
    db.updateBio(req.body.bioText, req.session.userId).then(rows => {
        console.log("rows from db.updateBio ", rows);
        res.json({ rows: rows });
    });
});
//Naming convention: routes starting with api says: we only get info from the ///server
app.get("/api/user/:id", (req, res) => {
    console.log("req.params.id", req.params.id);
    db.getUserInfo(req.params.id).then(rows => {
        console.log("rows[0]: ", rows[0]);
        rows[0].password = "you wish";
        console.log("rows[0]: ", rows[0]);
        if (rows[0].length == 0) {
            res.json({ success: false });
        } else {
            res.json({
                id: rows[0].id,
                first: rows[0].first,
                last: rows[0].last,
                imageUrl: rows[0].imageurl,
                bio: rows[0].bio,
                currentId: req.session.userId
            });
        }
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
