# HireAI — AI-Powered Job Board

A full-stack job board platform where recruiters post jobs and candidates apply. AI features analyze resumes, generate cover letters, and identify skill gaps — all powered by GPT-4o-mini.

![HireAI Screenshot Placeholder](./docs/screenshots/dashboard.png)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6 |
| Backend | FastAPI (Python 3.11+) |
| ORM | SQLAlchemy 2.0 |
| Database | MySQL 8 |
| Auth | JWT (python-jose) + bcrypt |
| AI | OpenAI API — gpt-4o-mini |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        React Frontend                        │
│   AuthContext → axios (JWT interceptor) → FastAPI REST API  │
└─────────────────────────┬───────────────────────────────────┘
                          │ HTTP / JSON
┌─────────────────────────▼───────────────────────────────────┐
│                      FastAPI Backend                         │
│                                                             │
│  /api/auth   → JWT register/login                          │
│  /api/jobs   → CRUD job postings                           │
│  /api/apply  → Candidate applications                      │
│  /api/ai     → OpenAI resume/cover letter/skill gap        │
│  /api/profile → User profile + resume upload               │
│  /api/dashboard → Aggregated stats per role                │
└─────────────────────────┬───────────────────────────────────┘
                          │ SQLAlchemy ORM
┌─────────────────────────▼───────────────────────────────────┐
│                         MySQL 8                              │
│   users · jobs · applications · skills · user_skills        │
└─────────────────────────────────────────────────────────────┘
```

**Role-based access** is enforced at the route level via a `require_role()` dependency factory in FastAPI. The frontend mirrors this with a `<ProtectedRoute roles={[...]}>` wrapper.

---

## Features

### Authentication
- Register / Login with JWT tokens
- Role-based authorization: `admin`, `recruiter`, `candidate`
- bcrypt password hashing

### Job Management
- Recruiters create, edit, and delete job postings
- Job status: Draft → Active → Closed
- Categories, location, salary range, and tags
- Full-text search + filters on the public jobs page

### Candidate Features
- Profile with bio and location
- PDF resume upload
- Skill list (add / remove)
- Apply to active jobs with optional cover letter
- Track application status per job

### AI Features (GPT-4o-mini)
| Feature | Endpoint | What it does |
|---|---|---|
| Resume Match | `POST /api/ai/match-resume` | Scores fit %, lists missing skills, gives suggestions |
| Cover Letter | `POST /api/ai/cover-letter` | Generates a tailored cover letter |
| Skill Gap | `POST /api/ai/skill-gap` | Compares resume to JD, recommends learning resources |

### Dashboards
- **Recruiter**: total jobs, active listings, applications received, shortlisted count
- **Candidate**: jobs applied, pending / shortlisted / rejected counts

---

## Project Structure

```
jobboard/
├── backend/
│   ├── app/
│   │   ├── main.py            # FastAPI app, middleware, router registration
│   │   ├── config.py          # Pydantic settings (reads .env)
│   │   ├── database.py        # SQLAlchemy engine + session
│   │   ├── models/
│   │   │   └── models.py      # User, Job, Application, Skill, UserSkill
│   │   ├── schemas/
│   │   │   └── schemas.py     # Pydantic request/response models
│   │   ├── auth/
│   │   │   └── jwt.py         # Token creation, verification, role dependency
│   │   ├── routes/
│   │   │   ├── auth.py        # /api/auth/*
│   │   │   ├── jobs.py        # /api/jobs/*
│   │   │   ├── applications.py
│   │   │   ├── profile.py     # /api/profile/*
│   │   │   ├── dashboard.py
│   │   │   └── ai.py          # /api/ai/*
│   │   └── ai/
│   │       └── openai_service.py  # Wrapper around OpenAI SDK
│   ├── requirements.txt
│   └── .env.example
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── App.jsx            # Route definitions
        ├── index.js
        ├── context/
        │   └── AuthContext.jsx    # Global auth state
        ├── services/
        │   ├── api.js             # Axios instance with JWT interceptor
        │   └── jobsService.js     # All API calls
        ├── components/
        │   └── common/
        │       ├── Navbar.jsx
        │       └── ProtectedRoute.jsx
        ├── pages/
        │   ├── HomePage.jsx
        │   ├── LoginPage.jsx
        │   ├── RegisterPage.jsx
        │   ├── JobsPage.jsx
        │   ├── JobDetailPage.jsx
        │   ├── JobFormPage.jsx    # Create + Edit (same component)
        │   ├── DashboardPage.jsx  # Delegates to role-specific dashboard
        │   ├── RecruiterDashboard.jsx
        │   ├── CandidateDashboard.jsx
        │   ├── ApplicationsPage.jsx
        │   ├── AIToolsPage.jsx
        │   └── ProfilePage.jsx
        └── styles/
            └── global.css
```

---

## Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- MySQL 8 running locally (or via Docker)

### 1. Database

```sql
CREATE DATABASE jobboard_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend

```bash
cd backend

# create virtual env
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# install deps
pip install -r requirements.txt

# configure environment
cp .env.example .env
# edit .env — set DB_PASSWORD and OPENAI_API_KEY at minimum

# start server (tables are created automatically on first run)
uvicorn app.main:app --reload --port 8000
```

API docs available at: http://localhost:8000/api/docs

### 3. Frontend

```bash
cd frontend

# install deps
npm install

# configure (optional — defaults to http://localhost:8000)
cp .env.example .env

# start dev server
npm start
```

App available at: http://localhost:3000

---

## Example API Requests

### Register

```bash
curl -X POST http://localhost:8000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"full_name": "Jane Smith", "email": "jane@example.com", "password": "secret123", "role": "candidate"}'
```

### Login

```bash
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "jane@example.com", "password": "secret123"}'
```

### Post a Job (recruiter)

```bash
curl -X POST http://localhost:8000/api/jobs \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior React Engineer",
    "description": "We are looking for...",
    "category": "Engineering",
    "location": "Remote",
    "salary_min": 120000,
    "salary_max": 160000,
    "tags": "React,TypeScript,Node.js",
    "status": "active"
  }'
```

### AI Resume Match

```bash
curl -X POST http://localhost:8000/api/ai/match-resume \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "resume_text": "5 years React experience, TypeScript, REST APIs...",
    "job_description": "Senior Frontend Engineer — React, TypeScript, GraphQL required..."
  }'
```

---

## Screenshots

> _Add screenshots here after running the app locally._

| Page | Screenshot |
|---|---|
| Home / Landing | `docs/screenshots/home.png` |
| Job Listings | `docs/screenshots/jobs.png` |
| Candidate Dashboard | `docs/screenshots/candidate-dashboard.png` |
| Recruiter Dashboard | `docs/screenshots/recruiter-dashboard.png` |
| AI Tools | `docs/screenshots/ai-tools.png` |

---

## Future Improvements

- [ ] Email notifications on application status changes (SendGrid / SES)
- [ ] Resume PDF parsing — extract text automatically on upload
- [ ] Async background jobs for AI analysis (Celery + Redis)
- [ ] Pagination on job listings and application tables
- [ ] Admin panel for user management
- [ ] OAuth2 login (Google, GitHub)
- [ ] Saved/bookmarked jobs for candidates
- [ ] Recruiter company profile pages
- [ ] Rate limiting on AI endpoints to control OpenAI costs
- [ ] Docker Compose setup for one-command local dev

---

## License

MIT
