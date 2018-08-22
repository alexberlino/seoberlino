var spicedPg = require("spiced-pg");

var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:password@localhost:5432/petition"
);

module.exports.getSignatures = function(user_id) {
    return db
        .query(`SELECT * FROM signatures WHERE user_id=$1 `, [user_id])
        .then(results => {
            return results.rows;
        });
};

module.exports.getAllSignatures = function() {
    return db.query("SELECT * FROM signatures").then(results => {
        return results.rows;
    });
};

module.exports.deleteSign = function(user_id) {
    return db
        .query(
            `DELETE FROM signatures
            WHERE user_id=$1;`,
            [user_id]
        )
        .catch(function(err) {
            console.log("error deleting signature", err);
        });
};

module.exports.getSignatures2 = function() {
    return db
        .query(
            `SELECT signatures.id AS id, users.firstname AS firstname,
            profile.personalweb AS website, users.surname AS surname,
            profile.age AS age, profile.city AS city
            FROM signatures
                 JOIN users
                    ON signatures.user_id = users.id
                 FULL OUTER JOIN profile
                    ON signatures.user_id= profile.user_id
                    WHERE signatures.id IS NOT NULL`
        )
        .then(results => {
            return results.rows;
        });
};

module.exports.getSignatures3 = function(city) {
    return db
        .query(
            `SELECT signatures.id AS id, users.firstname AS firstname,
            profile.personalweb AS website, users.surname AS surname,
            profile.age AS age, profile.city AS city
            FROM signatures
                 JOIN users
                    ON signatures.user_id = users.id
                 JOIN profile
                    ON signatures.user_id= profile.user_id

            WHERE city = $1`,
            [city]
        )

        .then(results => {
            return results.rows;
        });
};

module.exports.addToDatabase = function(user_id, signature) {
    return db
        .query(
            `INSERT INTO signatures (user_id, signature)
        VALUES ($1, $2) RETURNING id`,
            [user_id, signature]
        )
        .catch(function(err) {
            console.log(err);
        });
};

module.exports.getUserByEmail = function(emailaddress) {
    return db.query(`SELECT id, password FROM users WHERE emailaddress = $1`, [
        emailaddress
    ]);
};

module.exports.getUserForLogin = function(emailaddress) {
    return db.query(
        `SELECT id, password, firstname, surname FROM users WHERE emailaddress = $1`,
        [emailaddress]
    );
};

module.exports.checkSign = function(user_id) {
    return db
        .query(`SELECT id FROM signatures WHERE user_id = $1`, [user_id])
        .then(results => {
            return results.rows[0];
        });
};

module.exports.getUserByUserId = function(user_id) {
    return db.query(`SELECT id, password FROM users WHERE user_id = $1`, [
        user_id
    ]);
};

module.exports.infosForEdit = function(user_id) {
    return db
        .query(
            `SELECT users.firstname AS firstname, users.surname AS surname,
            users.emailaddress AS emailaddress, profile.age AS age,
            profile.city AS city, profile.personalweb AS personalweb
            FROM profile
            JOIN users
            ON profile.user_id = users.id
            WHERE profile.user_id = $1
            `,
            [user_id]
        )
        .then(results => {
            return results.rows[0];
        });
};

module.exports.addUserToDb = function(
    firstname,
    surname,
    emailaddress,
    password
) {
    return db
        .query(
            `INSERT INTO users (firstname, surname, emailaddress, password)
        VALUES ($1, $2, $3, $4) RETURNING id`,
            [firstname, surname, emailaddress, password]
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
            [user_id, age || null, city || null, personalWeb || null]
        )
        .then(function() {})
        .catch(function(err) {
            console.log(err);
        });
};

module.exports.UpdateUserEditNoPwd = function(
    firstname,
    surname,
    emailaddress,
    id
) {
    return db
        .query(
            `UPDATE users SET firstname = $1, surname = $2, emailaddress = $3
            WHERE id = $4`,
            [firstname, surname, emailaddress, id]
        )
        .catch(function(err) {
            console.log(err);
        });
};
module.exports.UpdateUserEditPwd = function(
    firstname,
    surname,
    emailaddress,
    password,
    id
) {
    return db
        .query(
            `UPDATE users
            SET  firstname = $1, surname = $2, emailaddress = $3, password=$4
            WHERE id = $5`,
            [firstname, surname, emailaddress, password, id]
        )
        .catch(function(err) {
            console.log(err);
        });
};
module.exports.UpdateProfile = function(user_id, age, city, personalweb) {
    return db
        .query(
            `INSERT INTO profile (user_id, age, city, personalweb)
VALUES ($1, $2, $3, $4)
ON CONFLICT (user_id)
DO UPDATE SET age = $2, city = $3, personalWeb = $4;`,
            [user_id, age || null, city || null, personalweb || null]
        )
        .catch(function(err) {
            console.log(err);
        });
};

module.exports.infosForEdit = function(user_id) {
    return db
        .query(
            `SELECT users.firstname AS firstname, users.surname AS surname,
            users.emailaddress AS emailaddress, profile.age AS age,
            profile.city AS city, profile.personalweb AS personalweb
            FROM users
            FULL  JOIN profile
            ON profile.user_id = users.id
            WHERE profile.user_id = $1
            `,
            [user_id]
        )
        .then(results => {
            return results.rows[0];
        });
};

module.exports.infosForEditNoProf = function(user_id) {
    return db
        .query(`SELECT * FROM users WHERE id = $1`, [user_id])
        .then(results => {
            return results.rows[0];
        });
};
