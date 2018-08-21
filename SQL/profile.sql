DROP TABLE IF EXISTS profile;
CREATE TABLE profile (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    age INTEGER,
    city VARCHAR(230),
    personalweb VARCHAR(200)

);
