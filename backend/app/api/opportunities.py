import json
from typing import List, Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.database import get_db
from app.models.user import User
from app.models.profile import StudentProfile
from app.models.opportunity import Opportunity
from app.models.application import SavedOpportunity, Application
from app.schemas.opportunity import OpportunityCreate, OpportunityUpdate, OpportunityResponse
from app.services.auth import get_optional_current_user, get_current_admin
from app.ai.matcher import OpportunityMatcher

router = APIRouter(prefix="/opportunities", tags=["Opportunities"])

def parse_opp_dict(opp: Opportunity) -> dict:
    req_skills = []
    if opp.required_skills:
        try:
            req_skills = json.loads(opp.required_skills)
        except Exception:
            req_skills = [s.strip() for s in opp.required_skills.split(",") if s.strip()]

    pref_skills = []
    if opp.preferred_skills:
        try:
            pref_skills = json.loads(opp.preferred_skills)
        except Exception:
            pref_skills = [s.strip() for s in opp.preferred_skills.split(",") if s.strip()]

    eligible_branches = ["All"]
    if opp.eligible_branches:
        try:
            eligible_branches = json.loads(opp.eligible_branches)
        except Exception:
            eligible_branches = [b.strip() for b in opp.eligible_branches.split(",") if b.strip()]

    return {
        "id": opp.id,
        "title": opp.title,
        "organization": opp.organization,
        "type": opp.type,
        "description": opp.description,
        "required_skills": req_skills,
        "preferred_skills": pref_skills,
        "eligible_branches": eligible_branches,
        "minimum_year": opp.minimum_year,
        "maximum_year": opp.maximum_year,
        "experience_required": opp.experience_required,
        "location": opp.location,
        "mode": opp.mode,
        "deadline": opp.deadline,
        "apply_url": opp.apply_url,
        "is_demo": opp.is_demo,
        "created_at": opp.created_at
    }

def get_student_profile_dict(profile: StudentProfile) -> dict:
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
        "skills": [s.name for s in profile.skills],
        "interests": interests,
        "branch": profile.branch or "CSE",
        "year": profile.year or 3,
        "experience_level": profile.experience_level or "Intermediate",
        "career_preferences": prefs,
        "projects": profile.projects or []
    }

@router.get("", response_model=List[OpportunityResponse])
def get_opportunities(
    search: Optional[str] = Query(None, description="Search query"),
    type: Optional[str] = Query(None, description="Filter by type (Internship, Hackathon, etc.)"),
    mode: Optional[str] = Query(None, description="Filter by mode (Online, Offline, Hybrid)"),
    branch: Optional[str] = Query(None, description="Filter by branch"),
    skill: Optional[str] = Query(None, description="Filter by skill required"),
    sort_by: Optional[str] = Query("best_match", description="best_match, deadline, newest"),
    min_score: Optional[float] = Query(0.0, description="Minimum match score"),
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    query = db.query(Opportunity)

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                Opportunity.title.ilike(search_term),
                Opportunity.organization.ilike(search_term),
                Opportunity.description.ilike(search_term),
                Opportunity.required_skills.ilike(search_term)
            )
        )

    if type and type != "All":
        query = query.filter(Opportunity.type == type)

    if mode and mode != "All":
        query = query.filter(Opportunity.mode == mode)

    opp_records = query.all()
    opp_dicts = [parse_opp_dict(opp) for opp in opp_records]

    # Student context for match score computation & status checks
    saved_ids = set()
    app_status_map = {}
    student_profile = None

    if current_user and current_user.role == "student":
        student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
        if student_profile:
            saved = db.query(SavedOpportunity.opportunity_id).filter(SavedOpportunity.student_id == student_profile.id).all()
            saved_ids = {s[0] for s in saved}

            apps = db.query(Application).filter(Application.student_id == student_profile.id).all()
            app_status_map = {a.opportunity_id: a.status for a in apps}

    results = []
    if student_profile:
        student_data = get_student_profile_dict(student_profile)
        ranked = OpportunityMatcher.match_all(student_data, opp_dicts)
        for item in ranked:
            opp_data = item["opportunity"]
            opp_id = opp_data["id"]
            score = item["match_score"]

            if score < min_score:
                continue

            # Branch filter
            if branch and branch != "All":
                if branch not in opp_data.get("eligible_branches", []) and "All" not in opp_data.get("eligible_branches", []):
                    continue

            # Skill filter
            if skill and skill != "All":
                all_skills = [s.lower() for s in opp_data.get("required_skills", []) + opp_data.get("preferred_skills", [])]
                if skill.lower() not in all_skills:
                    continue

            opp_data["match_score"] = score
            opp_data["score_breakdown"] = item["score_breakdown"]
            opp_data["matched_skills"] = item["matched_skills"]
            opp_data["missing_skills"] = item["missing_skills"]
            opp_data["explanation"] = item["explanation"]
            opp_data["is_saved"] = opp_id in saved_ids
            opp_data["application_status"] = app_status_map.get(opp_id)
            results.append(opp_data)
    else:
        for opp_data in opp_dicts:
            opp_id = opp_data["id"]

            if branch and branch != "All":
                if branch not in opp_data.get("eligible_branches", []) and "All" not in opp_data.get("eligible_branches", []):
                    continue

            if skill and skill != "All":
                all_skills = [s.lower() for s in opp_data.get("required_skills", []) + opp_data.get("preferred_skills", [])]
                if skill.lower() not in all_skills:
                    continue

            opp_data["match_score"] = 0.0
            opp_data["is_saved"] = False
            opp_data["application_status"] = None
            results.append(opp_data)

    # Sorting
    if sort_by == "deadline":
        results.sort(key=lambda x: x.get("deadline", "9999-99-99"))
    elif sort_by == "newest":
        results.sort(key=lambda x: x.get("created_at") or datetime.min, reverse=True)
    elif sort_by == "best_match" and student_profile:
        results.sort(key=lambda x: x.get("match_score", 0), reverse=True)

    return results

@router.get("/{id}", response_model=OpportunityResponse)
def get_opportunity(
    id: int,
    current_user: Optional[User] = Depends(get_optional_current_user),
    db: Session = Depends(get_db)
):
    opp = db.query(Opportunity).filter(Opportunity.id == id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found.")

    opp_data = parse_opp_dict(opp)
    opp_data["is_saved"] = False
    opp_data["application_status"] = None

    if current_user and current_user.role == "student":
        student_profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
        if student_profile:
            student_data = get_student_profile_dict(student_profile)
            match_res = OpportunityMatcher.match_student_with_opportunity(student_data, opp_data)
            opp_data["match_score"] = match_res["match_score"]
            opp_data["score_breakdown"] = match_res["score_breakdown"]
            opp_data["matched_skills"] = match_res["matched_skills"]
            opp_data["missing_skills"] = match_res["missing_skills"]
            opp_data["explanation"] = match_res["explanation"]

            saved = db.query(SavedOpportunity).filter(
                SavedOpportunity.student_id == student_profile.id,
                SavedOpportunity.opportunity_id == id
            ).first()
            opp_data["is_saved"] = saved is not None

            app = db.query(Application).filter(
                Application.student_id == student_profile.id,
                Application.opportunity_id == id
            ).first()
            opp_data["application_status"] = app.status if app else None

    return opp_data

@router.post("", response_model=OpportunityResponse)
def create_opportunity(
    opp_in: OpportunityCreate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    opp = Opportunity(
        title=opp_in.title.strip(),
        organization=opp_in.organization.strip(),
        type=opp_in.type.strip(),
        description=opp_in.description.strip(),
        required_skills=json.dumps(opp_in.required_skills),
        preferred_skills=json.dumps(opp_in.preferred_skills),
        eligible_branches=json.dumps(opp_in.eligible_branches),
        minimum_year=opp_in.minimum_year,
        maximum_year=opp_in.maximum_year,
        experience_required=opp_in.experience_required,
        location=opp_in.location.strip(),
        mode=opp_in.mode.strip(),
        deadline=opp_in.deadline.strip(),
        apply_url=opp_in.apply_url.strip(),
        is_demo=opp_in.is_demo
    )
    db.add(opp)
    db.commit()
    db.refresh(opp)
    return parse_opp_dict(opp)

@router.put("/{id}", response_model=OpportunityResponse)
def update_opportunity(
    id: int,
    opp_in: OpportunityUpdate,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    opp = db.query(Opportunity).filter(Opportunity.id == id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found.")

    if opp_in.title is not None:
        opp.title = opp_in.title.strip()
    if opp_in.organization is not None:
        opp.organization = opp_in.organization.strip()
    if opp_in.type is not None:
        opp.type = opp_in.type.strip()
    if opp_in.description is not None:
        opp.description = opp_in.description.strip()
    if opp_in.required_skills is not None:
        opp.required_skills = json.dumps(opp_in.required_skills)
    if opp_in.preferred_skills is not None:
        opp.preferred_skills = json.dumps(opp_in.preferred_skills)
    if opp_in.eligible_branches is not None:
        opp.eligible_branches = json.dumps(opp_in.eligible_branches)
    if opp_in.minimum_year is not None:
        opp.minimum_year = opp_in.minimum_year
    if opp_in.maximum_year is not None:
        opp.maximum_year = opp_in.maximum_year
    if opp_in.experience_required is not None:
        opp.experience_required = opp_in.experience_required
    if opp_in.location is not None:
        opp.location = opp_in.location.strip()
    if opp_in.mode is not None:
        opp.mode = opp_in.mode.strip()
    if opp_in.deadline is not None:
        opp.deadline = opp_in.deadline.strip()
    if opp_in.apply_url is not None:
        opp.apply_url = opp_in.apply_url.strip()
    if opp_in.is_demo is not None:
        opp.is_demo = opp_in.is_demo

    db.commit()
    db.refresh(opp)
    return parse_opp_dict(opp)

@router.delete("/{id}")
def delete_opportunity(
    id: int,
    current_admin: User = Depends(get_current_admin),
    db: Session = Depends(get_db)
):
    opp = db.query(Opportunity).filter(Opportunity.id == id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found.")

    db.delete(opp)
    db.commit()
    return {"message": "Opportunity deleted successfully."}
