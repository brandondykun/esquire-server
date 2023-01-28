
-- psql postgres < schema.sql
-- creating everything again
DROP DATABASE IF EXISTS esquiredb;

-- Create the db
CREATE DATABASE esquiredb;

-- Move into the db
\c esquiredb

-- User table for user accounts
CREATE TABLE IF NOT EXISTS "user"(
  id SERIAL PRIMARY KEY,
  email VARCHAR(64),
  password VARCHAR(64)
);

-- Client table for clients
CREATE TABLE IF NOT EXISTS client(
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(64),
  middle_name VARCHAR(64),
  last_name VARCHAR(64),
  user_id int,
  CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	  REFERENCES "user"(id)
);

-- Address table for client addresses
CREATE TABLE IF NOT EXISTS "address"(
  id SERIAL PRIMARY KEY,
  street VARCHAR(64),
  city VARCHAR(64),
  state VARCHAR(64),
  zip VARCHAR(64),
  client_id int,
  CONSTRAINT fk_client
      FOREIGN KEY(client_id) 
	  REFERENCES client(id)
);

-- Contact table for Client contact info
CREATE TABLE IF NOT EXISTS contact(
  id SERIAL PRIMARY KEY,
  phone VARCHAR(64),
  email VARCHAR(64),
  client_id int,
  CONSTRAINT fk_client
      FOREIGN KEY(client_id) 
	  REFERENCES client(id)
);

-- Case table for client cases
CREATE TABLE IF NOT EXISTS case(
  id SERIAL PRIMARY KEY,
  name VARCHAR(64),
  case_number VARCHAR(64),
  type VARCHAR(64),
  client_id int,
  CONSTRAINT fk_client
      FOREIGN KEY(client_id) 
	  REFERENCES client(id)
);

-- Case table for client cases
CREATE TABLE IF NOT EXISTS note(
  id SERIAL PRIMARY KEY,
  data JSONB,
  has_changes BOOLEAN,
  user_id int NOT NULL,
  client_id int,
  CONSTRAINT fk_client
      FOREIGN KEY(client_id) 
	  REFERENCES client(id),
  CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	  REFERENCES "user"(id)
);


-- Event table 
CREATE TABLE IF NOT EXISTS event(
  id SERIAL PRIMARY KEY,
  user_id int NOT NULL,
  name VARCHAR(255),
  date_from VARCHAR(255),
  date_to VARCHAR(255),
  meta VARCHAR(255),
  type VARCHAR(255),
  CONSTRAINT fk_user
      FOREIGN KEY(user_id) 
	  REFERENCES "user"(id)
);

-- SEED Users
INSERT INTO "user"
(email, password)
VALUES
('email1@gmail.com', 'pass1'),
('email2@gmail.com', 'pass2'),
('email3@gmail.com', 'pass3'),
('email4@gmail.com', 'pass4'),
('email5@gmail.com', 'pass5'),
('email6@gmail.com', 'pass6');

-- SEED Clients
INSERT INTO client
(first_name, middle_name, last_name, user_id)
VALUES
('John', 'Jacob', 'Smith', 1),
('Sarah', 'Elizabeth', 'Johnson', 1),
('Jason', 'Paul', 'Borne', 1),
('Ronald', 'William', 'Francis', 1),
('Michael', 'Henry', 'Miller', 1),
('William', 'Thomas', 'Clinton', 21),
('Paul', 'John', 'Jenkins', 21),
('Timoth', 'James', 'Banks', 1);

-- SEED Client Addresses
INSERT INTO "address"
(street, city, state, zip, client_id)
VALUES
('123 First Street', 'Freedom', 'PA', '15042', 1),
('34 South 10th Street', 'Greensburg', 'PA', '15601', 2),
('118 Crissinger Road', 'Greensburg', 'PA', '15042', 3),
('316 S 5th Street', 'Jeannette', 'PA', '15644', 4),
('718 Cloverleaf Circle', 'Delmont', 'PA', '15626', 5),
('193 Bovard Luxor Road', 'Latrobe', 'PA', '15650', 6);

-- SEED Client Contact Info
INSERT INTO contact
(email, phone, client_id)
VALUES
('johnsmith@gmail.com', '724-513-9897', 1),
('sarah.johnson@gmail.com', '724-622-3921', 2),
('thejasonborne12@yahoo.com', '412-561-2929', 3),
('bigronnyfrancis@gmail.com', '724-565-9878', 4),
('millerlite@gmail.com', '919-217-3467', 5),
('tjbanks@aol.com', '412-717-8745', 6);

-- SEED Client Cases
INSERT INTO "case"
(name, case_number, type, client_id)
VALUES
('Smith v. Commonwealth of PA', "PA-1723of2020 CU", "Criminal", 1),
('Smith v. Jackson', "PA-1723of2021 CU", "Civil Dispute", 1),
('Johnson v. Commonwealth of PA', "PA-1723of2021 CU", "Criminal", 2),
('Johnson v. Banks', "PA-2924of2021 CUU", "Civil Dispute", 2),
('Borne v. Commonwealth of PA', "PA-1723of2022 CU", "Criminal", 3),
('Borne v. Bond', "PA-1421of2011 CU", "Civil Dispute", 3),
('Francis v. Commonwealth of PA', "PA-1723of2012 CU", "Contract Dispute", 4),
('Miller v. Commonwealth of PA', "PA-19323of2021 CU", "Criminal", 5),
('Miller v. Commonwealth of PA', "PA-1233of2019 CU", "Criminal", 5),
('Banks v. First National Bank', "NJ-8455of2011 CU", "Contract Dispute", 6);
