var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:password@localhost:5432/petition");

module.exports.getSignatures = function() {
    return db.query("SELECT * FROM signatures").then(results => {
        return results.rows;
    });
};

module.exports.addToDatabase = function(firstname, surname, signature) {
    return db
        .query(
            `INSERT INTO signatures (firstname, surname, signature)
        VALUES ($1, $2, $3) RETURNING id`,
            [firstname, surname, signature]
        )
        .catch(function(err) {
            console.log(err);
        });
};
