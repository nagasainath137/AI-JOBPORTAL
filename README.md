# HireAI — AI-Powered Job Board

A full-stack job board platform where recruiters post jobs and candidates apply. AI features analyze resumes, generate cover letters, and identify skill gaps — all powered by GPT-4o-mini.


## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router v6 |
| Backend | FastAPI (Python 3.11+) |
| ORM | SQLAlchemy 2.0 |
| Database | MySQL 8 |
| Auth | JWT (python-jose) + bcrypt |
| AI | OpenAI API — gpt-4o-mini |


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

### Dashboards
- **Recruiter**: total jobs, active listings, applications received, shortlisted count
- **Candidate**: jobs applied, pending / shortlisted / rejected counts

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



---

## License

MIT
