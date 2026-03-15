import json
from openai import OpenAI
from app.config import settings

client = OpenAI(api_key=settings.OPENAI_API_KEY)

# using gpt-4o-mini to keep costs low while still getting solid results
MODEL = "gpt-4o-mini"


def _chat(system: str, user: str) -> str:
    resp = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": system},
            {"role": "user", "content": user},
        ],
        temperature=0.4,
    )
    return resp.choices[0].message.content.strip()


def analyze_resume_match(resume_text: str, job_description: str) -> dict:
    system = (
        "You are a technical recruiter. Analyze the provided resume against a job description. "
        "Return ONLY a valid JSON object with keys: match_percentage (float 0-100), "
        "missing_skills (list of strings), suggestions (list of strings). No extra text."
    )
    user = f"RESUME:\n{resume_text}\n\nJOB DESCRIPTION:\n{job_description}"
    raw = _chat(system, user)

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        # fallback if the model adds markdown fences
        clean = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(clean)


def generate_cover_letter(resume_text: str, job_description: str, applicant_name: str) -> str:
    system = (
        "You are a professional career coach. Write a compelling, concise cover letter "
        "tailored to the job description using the candidate's resume. Sound human and specific, "
        "not generic. 3-4 paragraphs max."
    )
    user = (
        f"Applicant name: {applicant_name}\n\n"
        f"RESUME:\n{resume_text}\n\n"
        f"JOB DESCRIPTION:\n{job_description}"
    )
    return _chat(system, user)


def analyze_skill_gap(resume_text: str, job_description: str) -> dict:
    system = (
        "You are a career advisor. Identify the candidate's current skills from their resume "
        "and compare them to what the job requires. Return ONLY valid JSON with keys: "
        "current_skills (list), missing_skills (list), recommended_resources (list of short strings). "
        "No markdown, no extra text."
    )
    user = f"RESUME:\n{resume_text}\n\nJOB DESCRIPTION:\n{job_description}"
    raw = _chat(system, user)

    try:
        return json.loads(raw)
    except json.JSONDecodeError:
        clean = raw.replace("```json", "").replace("```", "").strip()
        return json.loads(clean)
