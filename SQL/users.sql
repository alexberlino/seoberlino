DROP TABLE IF EXISTS users;

CREATE TABLE users (
    -- sql specific in upper case
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(30) NOT NULL,
    surname VARCHAR(30) NOT NULL,
    emailAddress VARCHAR(30) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL

);

    -- VARCHAR varying characters, but not exceding 15 characters




-- INSERT INTO actors (name, age, 'number of oscars')
-- VALUES ('Leonardo DiCaprio', 41, 1);
-- SELECT name FROM signedby
