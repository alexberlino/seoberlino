const db = require("./SQL/db.js");
const { checkPass, hashPass } = require("./Public/hash.js");
const express = require("express");
const ca = require("chalk-animation");
const app = express();
app.use(express.static("./Public"));
app.use(express.static("./SQL"));
// const csurf = require("csurf");
var cookieSession = require("cookie-session");

const cookieParser = require("cookie-parser");
app.use(cookieParser());
// const spicedPg = require("spiced-pg");

var hb = require("express-handlebars");
app.set("view engine", "handlebars");

app.engine("handlebars", hb());
app.use(
    require("body-parser").urlencoded({
        extended: false
    })
);
app.use(
    cookieSession({
        secret: `yummy yummy.`,
        maxAge: 1000 * 60 * 60 * 24 * 14
    })
);

////////////////////login///////////////////////////

app.get("/login", checkSignedIn, function(req, res) {
    res.render("login", {
        layout: "petitionLog"
    });
});

// const emailAddress = req.body.emailAddress;
// let password = req.body.password;
app.post("/login", (req, res) => {
    if (req.body.password && req.body.emailAddress) {
        db.getUserByEmail(req.body.emailAddress)
            .then(function(result) {
                console.log(result.rows[0].password);
                return checkPass(
                    req.body.password,
                    result.rows[0].password
                ).then(doesMatch => {
                    if (doesMatch) {
                        console.log("match");
                        // req.session.userId = result.rows[0].id;
                        //get signature id by user id
                        req.session.userId = result.rows[0].id;
                        res.redirect("/");
                    } else {
                        console.log("no match");
                        console.log(req.body.password, result.rows[0].password);
                        throw new Error();
                    }
                });
            })
            .catch(function(e) {
                console.log("error catch" + e);
                res.render("login", {
                    layout: "petitionLog",
                    errorMessage: true
                });
            });
    } else {
        console.log("password or email missing");
        res.render("login", {
            layout: "petitionLog",
            errorMessage: true
        });
    }
});

/////////////////login///////////////////////////

/////////////////register///////////////////////////

app.get("/register", checkSignedIn, function(req, res) {
    res.render("register", {
        layout: "petitionLog"
    });
});

app.post("/register", (req, res) => {
    if (
        req.body.firstName &&
        req.body.surname &&
        req.body.emailAddress &&
        req.body.password
    ) {
        hashPass(req.body.password)
            .then(function(pass) {
                console.log(req.body.password);
                console.log(pass);
                return db.addUserToDb(
                    req.body.firstName,
                    req.body.surname,
                    req.body.emailAddress,
                    pass
                );
            })
            .then(function(result) {
                req.session.userId = result.rows[0].id;
                console.log(result.rows[0].id);

                res.redirect("/");
            })
            .catch(function() {
                console.log("error");
                res.render("register", {
                    layout: "petitionLog",
                    errorMessage: true
                });
            });
    } else {
        console.log("error");
        res.render("register", {
            layout: "petitionLog",
            errorMessage: true
        });
    }
});

/////////////////register///////////////////////////

// app.use(csurf());
///!!!!
//for POST requests(submit) forms
//input name=_csrf value=""{{crsrfToken}} type hidden

// app.use((req, res, next) => {
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });

////////////middleware//////////////////////////////

function checkSession(req, res, next) {
    if (!req.session.checked) {
        res.redirect("/");
    } else {
        next();
    }
}

function checkSignedPet(req, res, next) {
    if (req.session.checked) {
        res.redirect("/thankyou");
    } else {
        next();
    }
}

function checkSignedIn(req, res, next) {
    if (req.session.signId) {
        res.redirect("/buddies");
    } else {
        next();
    }
}

function checkNotSignedIn(req, res, next) {
    if (!req.session.userId) {
        res.redirect("/register");
    } else {
        next();
    }
}

////////////middleware//////////////////////////////

/////////////////petition///////////////////////////

app.get("/", checkNotSignedIn, checkSignedPet, function(req, res) {
    res.render("main", {
        layout: "petition"
    });
});

app.post("/", (req, res) => {
    const firstname = req.body.firstname;
    const surname = req.body.surname;
    const signature = req.body.signature;

    if (firstname && surname && signature) {
        return db
            .addToDatabase(firstname, surname, signature)
            .then(function(results) {
                req.session.checked = results.rows[0].id;
                res.redirect("/thankyou");
            });
    } else {
        console.log("error!!!!!!!!!!");

        res.render("main", {
            layout: "petition",
            errorMessage: true
        });
    }
});

/////////////////petition///////////////////////////

/////////////////thankyou///////////////////////////

app.get("/thankyou", checkSession, checkNotSignedIn, (req, res) => {
    // res.cookie("confirmCookie", "done");
    db.getSignatures()
        .then(function(results) {
            let sign = 0;
            for (let i = 0; i < results.length; i++) {
                if (results[i].id == req.session.checked) {
                    sign = results[i].signature;
                }
            }

            res.render("thankyou", {
                layout: "petition",
                numberSign: results.length,
                userSign: sign
            });
        })
        .catch(function(e) {
            console.log(e);
        });
});

/////////////////thankyou///////////////////////////

app.get("/logout", function(req, res) {
    req.session = null;
    res.redirect("/login");
});
/////////////////signatures///////////////////////////

app.get("/buddylist", checkNotSignedIn, checkSession, (req, res) => {
    db.getSignatures()
        .then(function(results) {
            res.render("buddylist", {
                layout: "petition",
                signs: results
            });
        })
        .catch(e => console.log(e));
});

/////////////////signatures///////////////////////////

app.get("/about", function(req, res) {
    res.render("about", {
        layout: "petition"
    });
});

app.get("/contact", function(req, res) {
    res.render("contact", {
        layout: "petition"
    });
});

app.get("/aboutus", function(req, res) {
    res.render("about", {
        layout: "petitionLog"
    });
});

app.get("/contactus", function(req, res) {
    res.render("contact", {
        layout: "petitionLog"
    });
});

// listening
app.listen(8080, () => ca.rainbow("listening"));
