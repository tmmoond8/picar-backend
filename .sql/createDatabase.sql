CREATE SCHEMA picar_db;
CREATE USER 'picar'@'localhost' IDENTIFIED WITH mysql_native_password BY 'vlzk';
CREATE USER 'picar'@'%' IDENTIFIED WITH mysql_native_password BY 'vlzk';
GRANT ALL PRIVILEGES ON picar_db.* TO 'picar'@'localhost';
GRANT ALL PRIVILEGES ON picar_db.* TO 'picar'@'%' WITH GRANT OPTION;