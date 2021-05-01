CREATE SCHEMA owwners_db;
CREATE USER 'owwners'@'localhost' IDENTIFIED BY 'dhsjtm';
CREATE USER 'owwners'@'%' IDENTIFIED BY 'dhsjtm';
GRANT ALL PRIVILEGES ON owwners_db.* TO 'owwners'@'localhost';
GRANT ALL PRIVILEGES ON owwners_db.* TO 'owwners'@'%' WITH GRANT OPTION;