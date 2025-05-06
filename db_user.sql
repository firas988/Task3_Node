-- Create database
CREATE DATABASE IF NOT EXISTS `user_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Select database
USE `user_db`;

-- Creating the users table
CREATE TABLE IF NOT EXISTS `users` (
 `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
 `name` VARCHAR(255) NOT NULL,
 `email` VARCHAR(255) NOT NULL UNIQUE,
 `password` VARCHAR(255) NOT NULL,
 `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
 `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Optional: insert test data
INSERT INTO `users` (`name`, `email`, `password`) VALUES
('John Doe', 'john@example.com', 'hashed_password1'),
('Jane Doe', 'jane@example.com', 'hashed_password2');