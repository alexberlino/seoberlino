const express = require("express");
const app = express();
app.use(express.static("./Public"));

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

app.get("/", (req, res) => {
    res.render("home", {
        layout: "main"
    });
});

// listening
app.listen(process.env.PORT || 8080, () => console.log("listening"));
