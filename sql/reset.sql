DROP TABLE IF EXISTS reset;

CREATE TABLE reset(
  id SERIAL PRIMARY KEY,
  email VARCHAR NOT NULL CHECK (email != ''),
  secret_code VARCHAR NOT NULL CHECK (secret_code != ''),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
