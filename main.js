const db = require("./SQL/db.js");
const { checkPass, hashPass, capital } = require("./Public/hash.js");
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
////////////////////profile///////////////////////////

app.get("/profile", (req, res) => {
    res.render("profile", {
        layout: "petition"
    });
});

app.post("/profile", (req, res) => {
    return db
        .addProfileToDb(
            req.session.userId,
            req.body.age,
            req.body.city,
            req.body.personalweb
        )
        .then(function(results) {
            console.log(results);
            res.redirect("/");
        })
        .catch(function() {
            console.log("error");
            res.render("profile", {
                layout: "petitionLog",
                errorMessage: true
            });
        });
});

////////////////////profile///////////////////////////

app.get("/profile/edit", (req, res) => {
    db.infosForEdit(req.session.userId)

        .then(function(results) {
            console.log(results);

            res.render("profile-edit", {
                layout: "petition",
                user: results
            });
        })
        .catch(e => console.log(e));
});
app.post("/profile/edit", (req, res) => {
    const userDb = function() {
        if (req.body.password.length == 0) {
            return db.UpdateUserEditNoPwd(
                req.body.firstname,
                req.body.surname,
                req.body.emailaddress,
                req.session.userId
            );
        } else {
            hashPass(req.body.password)
                .then(pass => {
                    return db.UpdateUserEditPwd(
                        req.body.firstname,
                        req.body.surname,
                        req.body.emailaddress,
                        pass,
                        req.session.userId
                    );
                })
                .catch(function(e) {
                    console.log(e);
                });
        }
    };

    Promise.all([
        userDb(),
        db.UpdateProfile(
            req.session.userId,
            req.body.age,
            req.body.city,
            req.body.personalweb
        )
    ])

        .then(() => {
            //!!!!to do: update session.username etc with a function!!!!
            res.redirect("/thankyou");
        })
        .catch(function(e) {
            console.log(e);
        });
});

app.post("/profile", (req, res) => {
    console.log(
        req.session.userId,
        req.body.age,
        req.body.city,
        req.body.personalweb
    );
    return db
        .addProfileToDb(
            req.session.userId,
            req.body.age,
            req.body.city,
            req.body.personalweb
        )
        .then(function(result) {
            console.log(result);
        })
        .catch(function() {
            console.log("error");
            res.render("profile", {
                layout: "petitionLog",
                errorMessage: true
            });
        });
});

////////////////////login///////////////////////////

app.get("/login", checkSignedIn, function(req, res) {
    res.render("login", {
        layout: "petitionLog"
    });
});

// const emailaddress = req.body.emailaddress;
// let password = req.body.password;
app.post("/login", (req, res) => {
    db.getUserForLogin(req.body.emailaddress)
        .then(function(result) {
            if (!result) {
                throw new Error();
            } else {
                return checkPass(req.body.password, result.rows[0].password)
                    .then(function(doesMatch) {
                        if (doesMatch) {
                            req.session.userId = result.rows[0].id;
                            req.session.firstname = result.rows[0].firstname;
                            req.session.surname = result.rows[0].surname;
                        } else {
                            throw new Error();
                        }
                    })
                    .then(function() {
                        return db
                            .checkSign(req.session.userId)
                            .then(function(response) {
                                if (response == undefined) {
                                    res.redirect("/");
                                } else {
                                    req.session.checked = result.rows[0].id;
                                    res.redirect("/thankyou");
                                }
                            });
                    });
            }
        })

        .catch(function(e) {
            console.log("error catch" + e);
            res.render("login", {
                layout: "petitionLog",
                errorMessage: true
            });
        });
});
/////////////////login///////////////////////////

/////////////////register///////////////////////////

app.get("/register", checkSignedIn, function(req, res) {
    res.render("register", {
        layout: "petitionLog"
    });
});

app.post("/register", (req, res) => {
    hashPass(req.body.password)
        .then(pass => {
            return db.addUserToDb(
                req.body.firstname,
                req.body.surname,
                req.body.emailaddress,
                pass
            );
        })
        .then(result => {
            return (
                (req.session.userId = result.rows[0].id),
                (req.session.firstname = req.body.firstname),
                (req.session.surname = req.body.surname)
            );
        })
        .then(function() {
            console.log(
                req.session.userId,
                req.session.firstname,
                req.session.surname
            );
            res.redirect("/profile");
        })
        .catch(function() {
            console.log("error");
            res.render("register", {
                layout: "petitionLog",
                errorMessage: true
            });
        });
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
    if (req.session.userId) {
        res.redirect("/");
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
    console.log(
        req.session.userId,
        req.session.firstname,
        req.session.surname,
        req.body.signature
    );
    return db
        .addToDatabase(req.session.userId, req.body.signature)
        .then(function(results) {
            req.session.checked = results.rows[0].id;
            res.redirect("/thankyou");
        })
        .catch(function() {
            res.render("main", {
                layout: "petition",
                errorMessage: true
            });
        });
});

/////////////////petition///////////////////////////

/////////////////thankyou///////////////////////////

app.get("/thankyou", checkSession, checkNotSignedIn, (req, res) => {
    // res.cookie("confirmCookie", "done");

    db.getSignatures(req.session.userId)
        .then(function(result) {
            result[0].id == req.session.checked;
            const sign = result[0].signature;
            db.getAllSignatures().then(function(results) {
                res.render("thankyou", {
                    layout: "petition",
                    numberSign: results.length,
                    userSign: sign,
                    firstname: capital(req.session.firstname)
                });
            });
        })
        .catch(function(e) {
            console.log(e);
        });
});

app.post("/thankyou", (req, res) => {
    console.log(req.session.userdId);
    db.deleteSign(req.session.userId).then(function() {
        req.session.checked = req.session.unchecked;
        res.redirect("/");
    });
});

/////////////////thankyou///////////////////////////

app.get("/logout", function(req, res) {
    req.session = null;
    res.redirect("/login");
});
/////////////////signatures///////////////////////////

app.get("/buddylist", checkNotSignedIn, checkSession, (req, res) => {
    db.getSignatures2()
        .then(function(results) {
            console.log(results);

            res.render("buddylist", {
                layout: "petition",
                signs: results
            });
        })
        .catch(e => console.log(e));
});

app.get("/buddylist/:city", (req, res) => {
    db.getSignatures3(req.params.city)
        .then(function(results) {
            console.log(results);
            res.render("buddylist2", {
                layout: "petition",
                signs: results,
                city: capital(req.params.city)
            });
        })
        .catch(e => console.log(e));
});

/////////////////signatures///////////////////////////

app.get("/about", checkNotSignedIn, function(req, res) {
    res.render("about", {
        layout: "petition"
    });
});

app.get("/contact", checkNotSignedIn, function(req, res) {
    res.render("contact", {
        layout: "petition"
    });
});

app.post("/contact", checkNotSignedIn, function(req, res) {
    console.log("yes");
    res.render("contact", {
        layout: "petition",
        thanksMessage: true
    });
});

app.get("/aboutus", checkSignedIn, function(req, res) {
    res.render("about", {
        layout: "petitionLog"
    });
});

app.get("/contactus", checkSignedIn, function(req, res) {
    res.render("contact", {
        layout: "petitionLog"
    });
});

// listening
app.listen(process.env.PORT | 8080, () => ca.rainbow("listening"));
