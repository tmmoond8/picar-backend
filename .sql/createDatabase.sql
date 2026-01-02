CREATE DATABASE IF NOT EXISTS picar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'picar'@'localhost' IDENTIFIED WITH mysql_native_password BY 'vlzk';
CREATE USER 'picar'@'%' IDENTIFIED WITH mysql_native_password BY 'vlzk';
GRANT ALL PRIVILEGES ON picar_db.* TO 'picar'@'localhost';
GRANT ALL PRIVILEGES ON picar_db.* TO 'picar'@'%' WITH GRANT OPTION;