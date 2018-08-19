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

module.exports.getUserByEmail = function(emailAddress) {
    return db.query(`SELECT id, password FROM users WHERE emailAddress = $1`, [
        emailAddress
    ]);
};

module.exports.addUserToDb = function(
    firstname,
    surname,
    emailAddress,
    password
) {
    return db
        .query(
            `INSERT INTO users (firstname, surname, emailAddress, password)
        VALUES ($1, $2, $3, $4) RETURNING id`,
            [firstname, surname, emailAddress, password]
        )
        .catch(function(err) {
            console.log(err);
        });
};
