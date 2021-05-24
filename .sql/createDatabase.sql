CREATE SCHEMA picar_db;
CREATE USER 'picar'@'localhost' IDENTIFIED BY 'dhsjtm';
CREATE USER 'picar'@'%' IDENTIFIED BY 'dhsjtm';
GRANT ALL PRIVILEGES ON picar_db.* TO 'picar'@'localhost';
GRANT ALL PRIVILEGES ON picar_db.* TO 'picar'@'%' WITH GRANT OPTION;