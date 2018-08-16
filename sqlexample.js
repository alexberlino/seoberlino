const spicePg = require("spiced-pg");

const { dbUser, dbPass } = require("./secrets");
const db = spicePg(`postgres:${dbUser}:${dbPass}@localhost:5432/cities`);

function changeCityName(id, name) {
    db.query(
        `UPDATE cities SET city = $2
    WHERE id = $1`,
        [id, name]
    )
        .then(function(results) {
            console.log(results);
        })
        .catch(function(errors) {
            console.log(errors);
        });
}

changeCityName(1, "freeLand");

/*rows result are objects, each column property name, value from the column is hte value of it*/
