import os
import shutil
from typing import List
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.models import User, Skill, UserSkill, UserRole
from app.schemas.schemas import UserOut, ProfileUpdate, SkillOut, AddSkillRequest
from app.auth.jwt import get_current_user, require_role

router = APIRouter(prefix="/api/profile", tags=["profile"])

UPLOAD_DIR = "uploads/resumes"
os.makedirs(UPLOAD_DIR, exist_ok=True)


@router.get("", response_model=UserOut)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user


@router.patch("", response_model=UserOut)
def update_profile(
    payload: ProfileUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.commit()
    db.refresh(current_user)
    return current_user


@router.post("/resume", response_model=UserOut)
def upload_resume(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_role(UserRole.candidate)),
):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are accepted")

    filename = f"resume_{current_user.id}.pdf"
    path = os.path.join(UPLOAD_DIR, filename)
    with open(path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    current_user.resume_path = path
    db.commit()
    db.refresh(current_user)
    return current_user


@router.get("/skills", response_model=List[SkillOut])
def get_skills(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return [us.skill for us in current_user.skills]


@router.post("/skills", status_code=201)
def add_skill(
    payload: AddSkillRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # get or create the skill entry
    skill = db.query(Skill).filter(Skill.name == payload.skill_name.lower()).first()
    if not skill:
        skill = Skill(name=payload.skill_name.lower())
        db.add(skill)
        db.flush()

    already_has = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id,
        UserSkill.skill_id == skill.id,
    ).first()
    if already_has:
        raise HTTPException(status_code=400, detail="Skill already added")

    db.add(UserSkill(user_id=current_user.id, skill_id=skill.id))
    db.commit()
    return {"message": f"Skill '{skill.name}' added"}


@router.delete("/skills/{skill_name}", status_code=204)
def remove_skill(
    skill_name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    skill = db.query(Skill).filter(Skill.name == skill_name.lower()).first()
    if not skill:
        raise HTTPException(status_code=404, detail="Skill not found")

    user_skill = db.query(UserSkill).filter(
        UserSkill.user_id == current_user.id,
        UserSkill.skill_id == skill.id,
    ).first()
    if not user_skill:
        raise HTTPException(status_code=404, detail="You don't have this skill listed")

    db.delete(user_skill)
    db.commit()
