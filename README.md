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
