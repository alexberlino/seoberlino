const bcrypt = require("bcryptjs");
const { promisify } = require("util");

const genSalt = promisify(bcrypt.genSalt);
const hash = promisify(bcrypt.hash);
const compare = promisify(bcrypt.compare);

module.exports.hashPass = pass => {
    return genSalt().then(salt => {
        return hash(pass, salt);
    });
};

module.exports.checkPass = (pass, hash) => {
    return compare(pass, hash);
};

module.exports.capital = function(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
};
// exports
//     .hashPass("patrick")
//     .then(hash => {
//         console.log(hash);
//         return exports.checkPass("patrick", hash);
//     })
//     .then(doesMatch => console.log(doesMatch));
