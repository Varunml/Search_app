CREATE USER search_app_user WITH PASSWORD 'Newyear20219$';

CREATE DATABASE search_app;

\c search_app

GRANT ALL PRIVILEGES ON DATABASE search_app TO search_app_user;

CREATE TABLE users ( user_id SERIAL PRIMARY KEY, name VARCHAR(40) UNIQUE NOT NULL,
 email VARCHAR(50) UNIQUE NOT NULL, created_at TIMESTAMPTZ DEFAULT NOW() not null, item_searched VARCHAR(30) ,
 phone_number TEXT, password VARCHAR(255) NOT NULL);

CREATE TABLE search (search_id SERIAL PRIMARY KEY,user_id INT NOT NULL, is_favourite BOOLEAN DEFAULT FALSE, CONSTRAINT fk_user FOREIGN KEY (user_id) 
REFERENCES users(user_id), item_name VARCHAR(50),
created_at TIMESTAMPTZ DEFAULT NOW() not null, updated_at TIMESTAMPTZ DEFAULT NOW());