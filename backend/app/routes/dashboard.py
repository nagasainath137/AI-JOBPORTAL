from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Job, Application, User, UserRole, JobStatus, ApplicationStatus
from app.schemas.schemas import RecruiterDashboard, CandidateDashboard
from app.auth.jwt import require_role

router = APIRouter(prefix="/api/dashboard", tags=["dashboard"])


@router.get("/recruiter", response_model=RecruiterDashboard)
def recruiter_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.recruiter, UserRole.admin)),
):
    total_jobs = db.query(Job).filter(Job.recruiter_id == current_user.id).count()
    active_jobs = db.query(Job).filter(
        Job.recruiter_id == current_user.id,
        Job.status == JobStatus.active,
    ).count()

    # count apps across all this recruiter's jobs
    job_ids = [j.id for j in db.query(Job.id).filter(Job.recruiter_id == current_user.id)]
    total_apps = db.query(Application).filter(Application.job_id.in_(job_ids)).count()
    shortlisted = db.query(Application).filter(
        Application.job_id.in_(job_ids),
        Application.status == ApplicationStatus.shortlisted,
    ).count()

    return RecruiterDashboard(
        total_jobs=total_jobs,
        active_jobs=active_jobs,
        total_applications=total_apps,
        shortlisted_count=shortlisted,
    )


@router.get("/candidate", response_model=CandidateDashboard)
def candidate_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.candidate)),
):
    apps = db.query(Application).filter(Application.candidate_id == current_user.id).all()

    return CandidateDashboard(
        total_applied=len(apps),
        pending=sum(1 for a in apps if a.status == ApplicationStatus.pending),
        shortlisted=sum(1 for a in apps if a.status == ApplicationStatus.shortlisted),
        rejected=sum(1 for a in apps if a.status == ApplicationStatus.rejected),
    )
