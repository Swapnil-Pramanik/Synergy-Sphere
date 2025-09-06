-- MySQL initialization script for Synergy Sphere
CREATE DATABASE IF NOT EXISTS `synergy_sphere`;
USE `synergy_sphere`;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status ENUM('active','completed','pending','in-progress') DEFAULT 'active',
  progress INT DEFAULT 0,
  due_date DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS project_members (
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  role VARCHAR(100),
  PRIMARY KEY (project_id, user_id),
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  status ENUM('todo','in-progress','done') DEFAULT 'todo',
  priority ENUM('low','medium','high') DEFAULT 'medium',
  assignee_user_id INT NULL,
  due_date DATE NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (assignee_user_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS discussions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  user_id INT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Seed data
-- bcrypt hash for password: password123
INSERT INTO users (name, email, password_hash) VALUES 
('Alex Morgan','alex@example.com','$2a$10$V4yX1kYtYqUjQeG2G0kO4O0m4mM8Zb2m0s4f1Xv5lG4dE7o7XxG2a'),
('Sarah Johnson','sarah@example.com','$2a$10$V4yX1kYtYqUjQeG2G0kO4O0m4mM8Zb2m0s4f1Xv5lG4dE7o7XxG2a'),
('Mike Chen','mike@example.com','$2a$10$V4yX1kYtYqUjQeG2G0kO4O0m4mM8Zb2m0s4f1Xv5lG4dE7o7XxG2a'),
('Lisa Park','lisa@example.com','$2a$10$V4yX1kYtYqUjQeG2G0kO4O0m4mM8Zb2m0s4f1Xv5lG4dE7o7XxG2a')
ON DUPLICATE KEY UPDATE name=VALUES(name);

INSERT INTO projects (title, description, status, progress, due_date) VALUES 
('Website Redesign','Complete overhaul of company website with modern design and improved UX','active',75,'2024-01-15'),
('Mobile App Development','Cross-platform mobile application for iOS and Android','in-progress',45,'2024-02-28'),
('Brand Identity Refresh','New logo, color palette, and brand guidelines for 2024','pending',20,'2024-03-10'),
('Customer Support Portal','Self-service portal with knowledge base and ticket system','completed',100,'2023-12-15')
ON DUPLICATE KEY UPDATE description=VALUES(description);

-- Assign all users to Website Redesign with roles
INSERT IGNORE INTO project_members (project_id, user_id, role)
SELECT p.id, u.id, CASE u.name 
  WHEN 'Alex Morgan' THEN 'Project Manager'
  WHEN 'Sarah Johnson' THEN 'UI Designer'
  WHEN 'Mike Chen' THEN 'Frontend Developer'
  WHEN 'Lisa Park' THEN 'Backend Developer'
  ELSE 'Member' END
FROM projects p CROSS JOIN users u WHERE p.title='Website Redesign';

-- Tasks
INSERT INTO tasks (project_id, title, description, status, priority, assignee_user_id, due_date) VALUES
((SELECT id FROM projects WHERE title='Website Redesign'),'Design Homepage Layout','Create wireframes and mockups for the new homepage','done','high',(SELECT id FROM users WHERE name='Sarah Johnson'),'2024-01-10'),
((SELECT id FROM projects WHERE title='Website Redesign'),'Implement Navigation Menu','Build responsive navigation with dropdown menus','in-progress','medium',(SELECT id FROM users WHERE name='Mike Chen'),'2024-01-12'),
((SELECT id FROM projects WHERE title='Website Redesign'),'User Authentication System','Set up login, signup, and password reset functionality','in-progress','high',(SELECT id FROM users WHERE name='Lisa Park'),'2024-01-14'),
((SELECT id FROM projects WHERE title='Website Redesign'),'Content Management Integration','Connect with CMS for dynamic content updates','todo','medium',(SELECT id FROM users WHERE name='Lisa Park'),'2024-01-16'),
((SELECT id FROM projects WHERE title='Website Redesign'),'Mobile Responsiveness Testing','Test and optimize for all mobile devices','todo','low',(SELECT id FROM users WHERE name='Mike Chen'),'2024-01-18')
ON DUPLICATE KEY UPDATE title=VALUES(title);
