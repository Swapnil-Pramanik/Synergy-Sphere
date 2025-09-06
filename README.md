
  # SynergySphere UI Kit Design

  This is a code bundle for SynergySphere UI Kit Design. The original project is available at https://www.figma.com/design/PpH1AgiK4WOUhgr2ekNhjN/SynergySphere-UI-Kit-Design.

  ## Quick Start (How to run)
  Prerequisites:
  - Node.js 18+ and npm
  - MySQL Server running locally

  Steps:
  1) Install dependencies
     - npm install
  2) Initialize the database (choose one):
     - Option A: Run the SQL file in your MySQL client: database/init.sql
     - Option B: Use the Node helper (auto-creates DB/tables/seeds): npm run db:init
  3) Start the backend API (port 4000 by default)
     - npm run server
  4) Start the frontend (Vite dev server on port 5173 by default)
     - npm run dev

  Then open http://localhost:5173 in your browser. The frontend calls the API at VITE_API_URL (default http://localhost:4000). Set VITE_API_URL in a .env file if your backend runs elsewhere.

  ## Configuration
  Frontend:
  - VITE_API_URL=http://localhost:4000 (default if not set)

  Backend/DB (can be overridden via env vars):
  - MYSQL_HOST=localhost
  - MYSQL_USER=root
  - MYSQL_PASSWORD="spcse@2024"
  - MYSQL_DB=synergy_sphere
  - PORT=4000 (backend)
  - JWT_SECRET=dev-secret-change-me (used for signing JWT tokens)

  You can set env vars inline when starting the server, for example:
  - MYSQL_DB=synergy_sphere_dev PORT=5000 npm run server
  - PORT=3000 npm run server  # optional: if you set VITE_API_URL to 3000

  ## Verifying the API
  - Health check: curl http://localhost:4000/api/health
  - Login (demo user: alex@example.com / password123):
    curl -X POST -H "Content-Type: application/json" -d '{"email":"alex@example.com","password":"password123"}' http://localhost:4000/api/login
  - List projects: curl http://localhost:4000/api/projects
  - Project tasks: curl http://localhost:4000/api/projects/1/tasks

  ## Troubleshooting
  - MySQL access denied: Ensure the root user has password "spcse@2024" and MySQL is listening on localhost. Update env vars if different.
  - Port already in use: Change PORT for backend or use a free port, e.g., PORT=5000 npm run server.
  - Cannot connect to DB: Start MySQL service and confirm credentials. If schema is missing, rerun npm run db:init.

  ## API Endpoints
  - GET /api/health
  - POST /api/login  { email, password }
  - POST /api/auth/signup  { name, email, password }
  - GET /api/projects
  - GET /api/projects/:id
  - GET /api/projects/:id/tasks
  - GET /api/projects/:id/discussions
  - POST /api/projects/:id/discussions   (requires Authorization: Bearer <token>)
  - GET /api/stats/overview
  - POST /api/projects   (requires Authorization: Bearer <token>)
  - POST /api/tasks      (requires Authorization: Bearer <token>)
  - PUT /api/tasks/:id   (requires Authorization: Bearer <token>)

  CORS is enabled for local development.
  