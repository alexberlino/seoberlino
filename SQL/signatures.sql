DROP TABLE IF EXISTS signatures;
CREATE TABLE signatures (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    firstname VARCHAR(15) NOT NULL,
    surname VARCHAR(15) NOT NULL,
    signature TEXT NOT NULL


);



    -- VARCHAR varying characters, but not exceding 15 characters




-- INSERT INTO actors (name, age, 'number of oscars')
-- VALUES ('Leonardo DiCaprio', 41, 1);
-- SELECT name FROM signedby
