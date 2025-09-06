const mysql = require('mysql2/promise');

const DB_NAME = process.env.MYSQL_DB || 'synergy_sphere';
const DB_HOST = process.env.MYSQL_HOST || 'localhost';
const DB_USER = process.env.MYSQL_USER || 'root';
const DB_PASS = process.env.MYSQL_PASSWORD || 'spcse@2024';

async function getConnection() {
  const conn = await mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    multipleStatements: true,
  });
  // Ensure database exists
  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
  await conn.query(`USE \`${DB_NAME}\``);
  return conn;
}

async function initDb() {
  const conn = await getConnection();

  // Create tables if not exist
  await conn.query(`
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
  `);

  // Seed minimal data if empty
  const [users] = await conn.query('SELECT COUNT(*) as cnt FROM users');
  if (users[0].cnt === 0) {
    // Precomputed bcrypt hash for password: password123
    const hash = '$2a$10$V4yX1kYtYqUjQeG2G0kO4O0m4mM8Zb2m0s4f1Xv5lG4dE7o7XxG2a';
    await conn.query(
      `INSERT INTO users (name, email, password_hash) VALUES 
       ('Alex Morgan','alex@example.com','${hash}'),
       ('Sarah Johnson','sarah@example.com','${hash}'),
       ('Mike Chen','mike@example.com','${hash}'),
       ('Lisa Park','lisa@example.com','${hash}')`
    );
  }

  const [projects] = await conn.query('SELECT COUNT(*) as cnt FROM projects');
  if (projects[0].cnt === 0) {
    await conn.query(
      `INSERT INTO projects (title, description, status, progress, due_date) VALUES 
       ('Website Redesign','Complete overhaul of company website with modern design and improved UX','active',75,'2024-01-15'),
       ('Mobile App Development','Cross-platform mobile application for iOS and Android','in-progress',45,'2024-02-28'),
       ('Brand Identity Refresh','New logo, color palette, and brand guidelines for 2024','pending',20,'2024-03-10'),
       ('Customer Support Portal','Self-service portal with knowledge base and ticket system','completed',100,'2023-12-15')`
    );

    // map members to first project
    await conn.query(`
      INSERT INTO project_members (project_id, user_id, role)
      SELECT p.id, u.id, CASE u.name 
        WHEN 'Alex Morgan' THEN 'Project Manager'
        WHEN 'Sarah Johnson' THEN 'UI Designer'
        WHEN 'Mike Chen' THEN 'Frontend Developer'
        WHEN 'Lisa Park' THEN 'Backend Developer'
        ELSE 'Member' END
      FROM projects p CROSS JOIN users u WHERE p.title='Website Redesign';
    `);
  }

  const [tasksCount] = await conn.query('SELECT COUNT(*) as cnt FROM tasks');
  if (tasksCount[0].cnt === 0) {
    // Assign tasks to Website Redesign (id = 1 assumed after insert order)
    await conn.query(`
      INSERT INTO tasks (project_id, title, description, status, priority, assignee_user_id, due_date) VALUES
      (1,'Design Homepage Layout','Create wireframes and mockups for the new homepage','done','high',(SELECT id FROM users WHERE name='Sarah Johnson'),'2024-01-10'),
      (1,'Implement Navigation Menu','Build responsive navigation with dropdown menus','in-progress','medium',(SELECT id FROM users WHERE name='Mike Chen'),'2024-01-12'),
      (1,'User Authentication System','Set up login, signup, and password reset functionality','in-progress','high',(SELECT id FROM users WHERE name='Lisa Park'),'2024-01-14'),
      (1,'Content Management Integration','Connect with CMS for dynamic content updates','todo','medium',(SELECT id FROM users WHERE name='Lisa Park'),'2024-01-16'),
      (1,'Mobile Responsiveness Testing','Test and optimize for all mobile devices','todo','low',(SELECT id FROM users WHERE name='Mike Chen'),'2024-01-18')
    `);
  }

  return conn;
}

module.exports = { getConnection, initDb, DB_NAME };
