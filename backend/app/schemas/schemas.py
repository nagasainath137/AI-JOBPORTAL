from datetime import datetime
from typing import Optional, List
from pydantic import BaseModel, EmailStr
from app.models.models import UserRole, JobStatus, ApplicationStatus


# ── Auth ──────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    password: str
    role: UserRole = UserRole.candidate


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: UserRole
    user_id: int


# ── User / Profile ────────────────────────────────────────────────────────────

class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    role: UserRole
    bio: Optional[str] = None
    location: Optional[str] = None
    resume_path: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


class ProfileUpdate(BaseModel):
    full_name: Optional[str] = None
    bio: Optional[str] = None
    location: Optional[str] = None


# ── Skills ────────────────────────────────────────────────────────────────────

class SkillOut(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True


class AddSkillRequest(BaseModel):
    skill_name: str


# ── Jobs ──────────────────────────────────────────────────────────────────────

class JobCreate(BaseModel):
    title: str
    description: str
    category: Optional[str] = None
    location: Optional[str] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    tags: Optional[str] = None
    status: JobStatus = JobStatus.draft


class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    tags: Optional[str] = None
    status: Optional[JobStatus] = None


class JobOut(BaseModel):
    id: int
    title: str
    description: str
    category: Optional[str] = None
    location: Optional[str] = None
    salary_min: Optional[float] = None
    salary_max: Optional[float] = None
    tags: Optional[str] = None
    status: JobStatus
    recruiter_id: int
    created_at: datetime

    class Config:
        from_attributes = True


# ── Applications ──────────────────────────────────────────────────────────────

class ApplicationCreate(BaseModel):
    cover_letter: Optional[str] = None


class ApplicationOut(BaseModel):
    id: int
    job_id: int
    candidate_id: int
    cover_letter: Optional[str] = None
    ai_match_score: Optional[float] = None
    status: ApplicationStatus
    applied_at: datetime
    job: Optional[JobOut] = None
    candidate: Optional[UserOut] = None

    class Config:
        from_attributes = True


class StatusUpdate(BaseModel):
    status: ApplicationStatus


# ── AI ────────────────────────────────────────────────────────────────────────

class ResumeMatchRequest(BaseModel):
    resume_text: str
    job_description: str


class ResumeMatchResponse(BaseModel):
    match_percentage: float
    missing_skills: List[str]
    suggestions: List[str]


class CoverLetterRequest(BaseModel):
    resume_text: str
    job_description: str
    applicant_name: str


class CoverLetterResponse(BaseModel):
    cover_letter: str


class SkillGapRequest(BaseModel):
    resume_text: str
    job_description: str


class SkillGapResponse(BaseModel):
    current_skills: List[str]
    missing_skills: List[str]
    recommended_resources: List[str]


# ── Dashboard ─────────────────────────────────────────────────────────────────

class RecruiterDashboard(BaseModel):
    total_jobs: int
    active_jobs: int
    total_applications: int
    shortlisted_count: int


class CandidateDashboard(BaseModel):
    total_applied: int
    pending: int
    shortlisted: int
    rejected: int
