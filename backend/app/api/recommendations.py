import json
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.profile import StudentProfile
from app.models.opportunity import Opportunity
from app.models.recommendation import Recommendation
from app.models.application import SavedOpportunity, Application
from app.schemas.recommendation import RecommendationResponse, SkillGapResponse
from app.services.auth import get_current_user
from app.ai.matcher import OpportunityMatcher
from app.api.opportunities import parse_opp_dict, get_student_profile_dict

router = APIRouter(prefix="/recommendations", tags=["AI Recommendations"])

def compute_and_save_recommendations(profile: StudentProfile, db: Session) -> List[dict]:
    student_data = get_student_profile_dict(profile)
    opportunities = db.query(Opportunity).all()
    opp_dicts = [parse_opp_dict(opp) for opp in opportunities]

    ranked = OpportunityMatcher.match_all(student_data, opp_dicts)

    # Saved and application status maps
    saved_ids = {s[0] for s in db.query(SavedOpportunity.opportunity_id).filter(SavedOpportunity.student_id == profile.id).all()}
    apps = db.query(Application).filter(Application.student_id == profile.id).all()
    app_map = {a.opportunity_id: a.status for a in apps}

    # Clear previous cached recommendations for this student
    db.query(Recommendation).filter(Recommendation.student_id == profile.id).delete()

    results = []
    for item in ranked:
        opp_data = item["opportunity"]
        opp_id = opp_data["id"]
        score_bd = item["score_breakdown"]

        # Save to DB
        rec_entry = Recommendation(
            student_id=profile.id,
            opportunity_id=opp_id,
            match_score=item["match_score"],
            skill_score=score_bd["skill_score"],
            interest_score=score_bd["interest_score"],
            branch_score=score_bd["branch_score"],
            experience_score=score_bd["experience_score"],
            eligibility_score=score_bd["eligibility_score"],
            nlp_score=score_bd["nlp_score"],
            explanation=json.dumps(item["explanation"]),
            skills_matched=json.dumps(item["matched_skills"]),
            skills_missing=json.dumps(item["missing_skills"])
        )
        db.add(rec_entry)

        opp_data["match_score"] = item["match_score"]
        opp_data["score_breakdown"] = score_bd
        opp_data["matched_skills"] = item["matched_skills"]
        opp_data["missing_skills"] = item["missing_skills"]
        opp_data["explanation"] = item["explanation"]
        opp_data["is_saved"] = opp_id in saved_ids
        opp_data["application_status"] = app_map.get(opp_id)

        results.append({
            "opportunity_id": opp_id,
            "match_score": item["match_score"],
            "score_breakdown": score_bd,
            "matched_skills": item["matched_skills"],
            "missing_skills": item["missing_skills"],
            "explanation": item["explanation"],
            "opportunity": opp_data
        })

    db.commit()
    return results

@router.get("", response_model=List[RecommendationResponse])
def get_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found. Please complete profile setup.")

    # Calculate real-time recommendations
    results = compute_and_save_recommendations(profile, db)
    return results

@router.post("/generate", response_model=List[RecommendationResponse])
def generate_recommendations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    results = compute_and_save_recommendations(profile, db)
    return results

@router.get("/skill-gap", response_model=SkillGapResponse)
def get_skill_gap(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    student_data = get_student_profile_dict(profile)
    opportunities = db.query(Opportunity).all()
    opp_dicts = [parse_opp_dict(opp) for opp in opportunities]

    ranked = OpportunityMatcher.match_all(student_data, opp_dicts)
    gap_analysis = OpportunityMatcher.analyze_skill_gap(student_data["skills"], ranked)

    return gap_analysis
