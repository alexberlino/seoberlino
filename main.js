const db = require("./SQL/db.js");
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

// app.use((req, res, next) => {
//     if (req.cookies.confirmCookie && req.url == "/") {
//         ca.karaoke("Already has a Cookie");
//         res.redirect("/thankyou");
//     } else {
//         ca.karaoke("no Cookie spotted");
//
//         next();
//     }
// });
//
// app.use((req, res, next) => {
//     if (!req.cookies.confirmCookie && req.url == "/buddylist") {
//         ca.karaoke("No cookie");
//         res.redirect("/");
//     } else {
//         next();
//     }
// });

// app.use(csurf());
///!!!!
//for POST requests(submit) forms
//input name=_csrf value=""{{crsrfToken}} type hidden

// app.use((req, res, next) => {
//     res.locals.csrfToken = req.csrfToken();
//     next();
// });

const checkSession = (req, res, next) => {
    if (!req.session.checked) {
        res.redirect("/");
    } else {
        next();
    }
};

app.get("/", function(req, res) {
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
        res.render("main", {
            layout: "petition",
            errorMessage: true
        });
    }
});

app.get("/thankyou", checkSession, (req, res) => {
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

app.get("/buddylist", (req, res) => {
    db.getSignatures()
        .then(function(results) {
            res.render("buddylist", {
                layout: "petition",
                signs: results
            });
        })
        .catch(e => console.log(e));
});

// listening
app.listen(8080, () => ca.rainbow("listening"));
