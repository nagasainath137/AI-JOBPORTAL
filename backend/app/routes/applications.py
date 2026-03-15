from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import Application, Job, User, UserRole, ApplicationStatus
from app.schemas.schemas import ApplicationCreate, ApplicationOut, StatusUpdate
from app.auth.jwt import get_current_user, require_role

router = APIRouter(prefix="/api", tags=["applications"])


@router.post("/apply/{job_id}", response_model=ApplicationOut, status_code=201)
def apply_to_job(
    job_id: int,
    payload: ApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.candidate)),
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")

    already_applied = db.query(Application).filter(
        Application.job_id == job_id,
        Application.candidate_id == current_user.id,
    ).first()
    if already_applied:
        raise HTTPException(status_code=400, detail="Already applied to this job")

    app = Application(
        job_id=job_id,
        candidate_id=current_user.id,
        cover_letter=payload.cover_letter,
    )
    db.add(app)
    db.commit()
    db.refresh(app)
    return app


@router.get("/applications/my", response_model=List[ApplicationOut])
def my_applications(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.candidate)),
):
    return (
        db.query(Application)
        .filter(Application.candidate_id == current_user.id)
        .order_by(Application.applied_at.desc())
        .all()
    )


@router.get("/applications/job/{job_id}", response_model=List[ApplicationOut])
def applications_for_job(
    job_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.recruiter, UserRole.admin)),
):
    job = db.query(Job).filter(Job.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    if job.recruiter_id != current_user.id and current_user.role != UserRole.admin:
        raise HTTPException(status_code=403, detail="Access denied")

    return db.query(Application).filter(Application.job_id == job_id).all()


@router.patch("/applications/{application_id}/status", response_model=ApplicationOut)
def update_application_status(
    application_id: int,
    payload: StatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.recruiter, UserRole.admin)),
):
    app = db.query(Application).filter(Application.id == application_id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application not found")

    app.status = payload.status
    db.commit()
    db.refresh(app)
    return app
