DROP TABLE IF EXISTS signatures;

CREATE TABLE signatures (
    -- sql specific in upper case
    id SERIAL PRIMARY KEY,
    firstname VARCHAR(15) NOT NULL,
    surname VARCHAR(15) NOT NULL,
    signature TEXT NOT NULL

);

INSERT INTO signatures (firstname, surname, signature) VALUES ('jacko', 'matto', 'bcvbvbvc');
INSERT INTO signatures (firstname, surname, signature) VALUES ('billy', 'kiddo', 'gxgfx');
INSERT INTO signatures (firstname, surname, signature) VALUES ('brit', 'patt', 'vdvcx');
INSERT INTO signatures (firstname, surname, signature) VALUES ('heather', 'feather', 'vcxvbc');
INSERT INTO signatures (firstname, surname, signature) VALUES ('cowie', 'mow', 'fsfsd');
INSERT INTO signatures (firstname, surname, signature) VALUES ('joan', 'darcko', 'yfdsfs');
INSERT INTO signatures (firstname, surname, signature) VALUES ('woodie', 'mallen', 'bdgffddf');
INSERT INTO signatures (firstname, surname, signature) VALUES ('elvis', 'press', 'vfxbcvnbvcnb');
INSERT INTO signatures (firstname, surname, signature) VALUES ('jackson', 'mikie', 'gdfgdfgf');
INSERT INTO signatures (firstname, surname, signature) VALUES ('roger', 'fedex', 'gdfgdfgf');

    -- VARCHAR varying characters, but not exceding 15 characters




-- INSERT INTO actors (name, age, 'number of oscars')
-- VALUES ('Leonardo DiCaprio', 41, 1);
-- SELECT name FROM signedby
