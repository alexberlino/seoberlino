DROP TABLE IF EXISTS profile;
CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    age INTEGER,
    city VARCHAR(230),
    personalWeb VARCHAR(200)

);
