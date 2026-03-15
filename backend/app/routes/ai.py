from fastapi import APIRouter, Depends, HTTPException
from app.models.models import User
from app.schemas.schemas import (
    ResumeMatchRequest, ResumeMatchResponse,
    CoverLetterRequest, CoverLetterResponse,
    SkillGapRequest, SkillGapResponse,
)
from app.auth.jwt import get_current_user
from app.ai.openai_service import analyze_resume_match, generate_cover_letter, analyze_skill_gap

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.post("/match-resume", response_model=ResumeMatchResponse)
def match_resume(
    payload: ResumeMatchRequest,
    current_user: User = Depends(get_current_user),
):
    try:
        result = analyze_resume_match(payload.resume_text, payload.job_description)
        return ResumeMatchResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")


@router.post("/cover-letter", response_model=CoverLetterResponse)
def cover_letter(
    payload: CoverLetterRequest,
    current_user: User = Depends(get_current_user),
):
    try:
        letter = generate_cover_letter(
            payload.resume_text,
            payload.job_description,
            payload.applicant_name,
        )
        return CoverLetterResponse(cover_letter=letter)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Cover letter generation failed: {str(e)}")


@router.post("/skill-gap", response_model=SkillGapResponse)
def skill_gap(
    payload: SkillGapRequest,
    current_user: User = Depends(get_current_user),
):
    try:
        result = analyze_skill_gap(payload.resume_text, payload.job_description)
        return SkillGapResponse(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Skill gap analysis failed: {str(e)}")
