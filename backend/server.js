const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { initDb, getConnection, DB_NAME } = require('./db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

// Health check
app.get('/api/health', async (req, res) => {
  try {
    await initDb();
    res.json({ status: 'ok', database: DB_NAME });
  } catch (e) {
    res.status(500).json({ status: 'error', error: e.message });
  }
});

// JWT config
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';
const TOKEN_EXPIRES_IN = '7d';

function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
}

function authRequired(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ message: 'Missing token' });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

// Signup
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body || {};
  if (!name || !email || !password) return res.status(400).json({ message: 'name, email, password required' });
  try {
    const conn = await getConnection();
    const [found] = await conn.query('SELECT id FROM users WHERE email = ?', [email]);
    if (found.length) return res.status(409).json({ message: 'Email already registered' });
    const hash = await bcrypt.hash(password, 10);
    const [result] = await conn.query('INSERT INTO users (name, email, password_hash) VALUES (?,?,?)', [name, email, hash]);
    const user = { id: result.insertId, name, email };
    const token = signToken({ sub: user.id, email: user.email });
    res.status(201).json({ user, token });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

// Login
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  try {
    const conn = await getConnection();
    const [rows] = await conn.query('SELECT id, name, email, password_hash FROM users WHERE email = ?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials' });
    const userRow = rows[0];
    const ok = await bcrypt.compare(password || '', userRow.password_hash);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const user = { id: userRow.id, name: userRow.name, email: userRow.email };
    const token = signToken({ sub: user.id, email: user.email });
    res.json({ user, token });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

// Projects list
app.get('/api/projects', async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query(`
      SELECT p.*, 
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) AS tasksTotal,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'done') AS tasksCompleted
      FROM projects p
      ORDER BY p.id`);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

// Project detail
app.get('/api/projects/:id', async (req, res) => {
  try {
    const conn = await getConnection();
    const [projects] = await conn.query(`
      SELECT p.*, 
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id) AS tasksTotal,
        (SELECT COUNT(*) FROM tasks t WHERE t.project_id = p.id AND t.status = 'done') AS tasksCompleted
      FROM projects p WHERE p.id = ?`, [req.params.id]);
    if (!projects.length) return res.status(404).json({ message: 'Not found' });

    const [members] = await conn.query(
      `SELECT u.id, u.name, pm.role 
       FROM project_members pm 
       JOIN users u ON u.id = pm.user_id 
       WHERE pm.project_id = ?`, [req.params.id]
    );

    res.json({ ...projects[0], members });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

// Tasks for project
app.get('/api/projects/:id/tasks', async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query(
      `SELECT t.*, a.name AS assignee_name 
       FROM tasks t 
       LEFT JOIN users a ON a.id = t.assignee_user_id 
       WHERE t.project_id = ? ORDER BY t.id`, [req.params.id]
    );
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

// Create project
app.post('/api/projects', authRequired, async (req, res) => {
  const { title, description, status = 'active', progress = 0, due_date = null } = req.body;
  if (!title) return res.status(400).json({ message: 'title is required' });
  try {
    const conn = await getConnection();
    const [result] = await conn.query(
      'INSERT INTO projects (title, description, status, progress, due_date) VALUES (?,?,?,?,?)',
      [title, description || null, status, progress, due_date]
    );
    const [rows] = await conn.query('SELECT * FROM projects WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

// Create task
app.post('/api/tasks', authRequired, async (req, res) => {
  const { project_id, title, description, status = 'todo', priority = 'medium', assignee_user_id = null, due_date = null } = req.body;
  if (!project_id || !title) return res.status(400).json({ message: 'project_id and title are required' });
  try {
    const conn = await getConnection();
    const [result] = await conn.query(
      'INSERT INTO tasks (project_id, title, description, status, priority, assignee_user_id, due_date) VALUES (?,?,?,?,?,?,?)',
      [project_id, title, description || null, status, priority, assignee_user_id, due_date]
    );
    const [rows] = await conn.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

// Update task
app.put('/api/tasks/:id', authRequired, async (req, res) => {
  const { title, description, status, priority, assignee_user_id, due_date } = req.body;
  try {
    const conn = await getConnection();
    await conn.query(
      'UPDATE tasks SET title = COALESCE(?, title), description = COALESCE(?, description), status = COALESCE(?, status), priority = COALESCE(?, priority), assignee_user_id = COALESCE(?, assignee_user_id), due_date = COALESCE(?, due_date) WHERE id = ?',
      [title ?? null, description ?? null, status ?? null, priority ?? null, assignee_user_id ?? null, due_date ?? null, req.params.id]
    );
    const [rows] = await conn.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Not found' });
    res.json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

// Discussions
app.get('/api/projects/:id/discussions', async (req, res) => {
  try {
    const conn = await getConnection();
    const [rows] = await conn.query(`
      SELECT d.id, d.message, d.created_at, u.id as user_id, u.name as user_name
      FROM discussions d
      JOIN users u ON u.id = d.user_id
      WHERE d.project_id = ?
      ORDER BY d.id DESC`, [req.params.id]);
    res.json(rows);
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

app.post('/api/projects/:id/discussions', authRequired, async (req, res) => {
  const { message } = req.body || {};
  if (!message || !message.trim()) return res.status(400).json({ message: 'message is required' });
  try {
    const conn = await getConnection();
    // Ensure project exists
    const [proj] = await conn.query('SELECT id FROM projects WHERE id = ?', [req.params.id]);
    if (!proj.length) return res.status(404).json({ message: 'Project not found' });
    const [result] = await conn.query('INSERT INTO discussions (project_id, user_id, message) VALUES (?,?,?)', [req.params.id, req.user.sub, message]);
    const [rows] = await conn.query(`
      SELECT d.id, d.message, d.created_at, u.id as user_id, u.name as user_name
      FROM discussions d
      JOIN users u ON u.id = d.user_id
      WHERE d.id = ?`, [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

// Stats overview
app.get('/api/stats/overview', async (req, res) => {
  try {
    const conn = await getConnection();
    const [[p], [t], [c], [m]] = await Promise.all([
      conn.query("SELECT COUNT(*) AS activeProjects FROM projects WHERE status IN ('active','in-progress')"),
      conn.query("SELECT COUNT(*) AS totalTasks FROM tasks"),
      conn.query("SELECT COUNT(*) AS completedTasks FROM tasks WHERE status='done'"),
      conn.query("SELECT COUNT(DISTINCT user_id) AS teamMembers FROM project_members")
    ]);
    res.json({
      activeProjects: p[0].activeProjects || 0,
      totalTasks: t[0].totalTasks || 0,
      completedTasks: c[0].completedTasks || 0,
      teamMembers: m[0].teamMembers || 0,
    });
  } catch (e) {
    res.status(500).json({ message: 'Server error', error: e.message });
  }
});

// Start server
async function start() {
  try {
    await initDb();
    app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
  } catch (e) {
    console.error('Failed to init DB:', e);
    process.exit(1);
  }
}

if (require.main === module) {
  start();
}

module.exports = app;
