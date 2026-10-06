import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.profile import StudentProfile, Skill, Project
from app.schemas.profile import ProfileUpdate, ProfileResponse, SkillResponse, ProjectCreate, ProjectResponse
from app.services.auth import get_current_user

router = APIRouter(prefix="", tags=["Student Profile"])

def format_profile_response(profile: StudentProfile, user: User) -> dict:
    interests = []
    if profile.interests:
        try:
            interests = json.loads(profile.interests)
        except Exception:
            interests = [i.strip() for i in profile.interests.split(",") if i.strip()]

    prefs = []
    if profile.career_preferences:
        try:
            prefs = json.loads(profile.career_preferences)
        except Exception:
            prefs = [p.strip() for p in profile.career_preferences.split(",") if p.strip()]

    return {
        "id": profile.id,
        "user_id": user.id,
        "name": user.name,
        "email": user.email,
        "college": profile.college or "",
        "branch": profile.branch or "CSE",
        "year": profile.year or 3,
        "experience_level": profile.experience_level or "Intermediate",
        "work_experience": profile.work_experience,
        "skills": [s.name for s in profile.skills],
        "interests": interests,
        "career_preferences": prefs,
        "projects": profile.projects or [],
        "updated_at": profile.updated_at
    }

@router.get("/profile", response_model=ProfileResponse)
def get_profile(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(
            user_id=current_user.id,
            college="Engineering College",
            branch="CSE",
            year=3,
            experience_level="Intermediate",
            interests=json.dumps([]),
            career_preferences=json.dumps([])
        )
        db.add(profile)
        db.commit()
        db.refresh(profile)

    return format_profile_response(profile, current_user)

@router.put("/profile", response_model=ProfileResponse)
def update_profile(
    profile_in: ProfileUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        profile = StudentProfile(user_id=current_user.id)
        db.add(profile)

    # Update basic profile attributes
    if profile_in.name and profile_in.name.strip():
        current_user.name = profile_in.name.strip()
    if profile_in.college is not None:
        profile.college = profile_in.college.strip()
    if profile_in.branch is not None:
        profile.branch = profile_in.branch.strip()
    if profile_in.year is not None:
        profile.year = profile_in.year
    if profile_in.experience_level is not None:
        profile.experience_level = profile_in.experience_level.strip()
    if profile_in.work_experience is not None:
        profile.work_experience = profile_in.work_experience.strip()

    if profile_in.interests is not None:
        profile.interests = json.dumps([i.strip() for i in profile_in.interests if i.strip()])
    if profile_in.career_preferences is not None:
        profile.career_preferences = json.dumps([p.strip() for p in profile_in.career_preferences if p.strip()])

    # Update skills
    if profile_in.skills is not None:
        profile.skills.clear()
        for skill_name in profile_in.skills:
            clean_name = skill_name.strip()
            if not clean_name:
                continue
            skill_obj = db.query(Skill).filter(Skill.name.ilike(clean_name)).first()
            if not skill_obj:
                skill_obj = Skill(name=clean_name)
                db.add(skill_obj)
                db.flush()
            profile.skills.append(skill_obj)

    db.commit()
    db.refresh(profile)
    return format_profile_response(profile, current_user)

@router.get("/skills", response_model=List[SkillResponse])
def get_skills(db: Session = Depends(get_db)):
    skills = db.query(Skill).order_by(Skill.name.asc()).all()
    return skills

@router.post("/projects", response_model=ProjectResponse)
def add_project(
    project_in: ProjectCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    project = Project(
        student_id=profile.id,
        title=project_in.title.strip(),
        description=project_in.description.strip(),
        technologies=project_in.technologies.strip()
    )
    db.add(project)
    db.commit()
    db.refresh(project)
    return project

@router.delete("/projects/{project_id}")
def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    project = db.query(Project).filter(Project.id == project_id, Project.student_id == profile.id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found.")

    db.delete(project)
    db.commit()
    return {"message": "Project deleted successfully."}
