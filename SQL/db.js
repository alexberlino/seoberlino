var spicedPg = require("spiced-pg");

var db = spicedPg("postgres:postgres:password@localhost:5432/petition");

module.exports.getSignatures = function() {
    return db.query("SELECT * FROM signatures").then(results => {
        return results.rows;
    });
};

module.exports.getSignatures2 = function() {
    return db
        .query(
            `SELECT signatures.firstname AS firstname, profile.personalWeb AS website, signatures.surname AS surname, profile.age AS age, profile.city AS city
            FROM signatures
            JOIN profile
            ON signatures.user_id = profile.user_id
`
        )
        .then(results => {
            return results.rows;
        });
};

module.exports.getSignatures3 = function(city) {
    return db
        .query(
            `SELECT signatures.firstname AS firstname, profile.personalWeb AS website, signatures.surname AS surname, profile.age AS age, profile.city AS city
            FROM signatures
            JOIN profile
            ON signatures.user_id = profile.user_id

            WHERE city = $1`,
            [city]
        )

        .then(results => {
            return results.rows;
        });
};

module.exports.addToDatabase = function(
    user_id,
    firstname,
    surname,
    signature
) {
    return db
        .query(
            `INSERT INTO signatures (user_id, firstname, surname, signature)
        VALUES ($1, $2, $3, $4) RETURNING id`,
            [user_id, firstname, surname, signature]
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

module.exports.addProfileToDb = function(user_id, age, city, personalWeb) {
    return db
        .query(
            `INSERT INTO profile (user_id, age, city, personalWeb)
        VALUES ($1, $2, $3, $4) RETURNING id`,
            [user_id, age, city, personalWeb]
        )
        .then(function() {})
        .catch(function(err) {
            console.log(err);
        });
};
