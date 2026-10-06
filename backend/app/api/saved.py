from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.profile import StudentProfile
from app.models.opportunity import Opportunity
from app.models.application import SavedOpportunity, Application
from app.schemas.application import SavedOpportunityResponse
from app.services.auth import get_current_user
from app.api.opportunities import parse_opp_dict, get_student_profile_dict
from app.ai.matcher import OpportunityMatcher

router = APIRouter(prefix="/saved", tags=["Saved Opportunities"])

@router.get("", response_model=List[SavedOpportunityResponse])
def get_saved_opportunities(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        return []

    saved_items = db.query(SavedOpportunity).filter(SavedOpportunity.student_id == profile.id).order_by(SavedOpportunity.created_at.desc()).all()
    if not saved_items:
        return []

    student_data = get_student_profile_dict(profile)
    apps = db.query(Application).filter(Application.student_id == profile.id).all()
    app_map = {a.opportunity_id: a.status for a in apps}

    results = []
    for item in saved_items:
        opp = item.opportunity
        opp_data = parse_opp_dict(opp)
        match_res = OpportunityMatcher.match_student_with_opportunity(student_data, opp_data)

        opp_data["match_score"] = match_res["match_score"]
        opp_data["score_breakdown"] = match_res["score_breakdown"]
        opp_data["matched_skills"] = match_res["matched_skills"]
        opp_data["missing_skills"] = match_res["missing_skills"]
        opp_data["explanation"] = match_res["explanation"]
        opp_data["is_saved"] = True
        opp_data["application_status"] = app_map.get(opp.id)

        results.append({
            "id": item.id,
            "student_id": item.student_id,
            "opportunity_id": item.opportunity_id,
            "created_at": item.created_at,
            "opportunity": opp_data,
            "match_score": match_res["match_score"]
        })

    return results

@router.post("/{opportunity_id}")
def save_opportunity(
    opportunity_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    opp = db.query(Opportunity).filter(Opportunity.id == opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found.")

    existing = db.query(SavedOpportunity).filter(
        SavedOpportunity.student_id == profile.id,
        SavedOpportunity.opportunity_id == opportunity_id
    ).first()

    if existing:
        return {"message": "Opportunity already saved.", "saved": True}

    saved = SavedOpportunity(student_id=profile.id, opportunity_id=opportunity_id)
    db.add(saved)
    db.commit()
    return {"message": "Opportunity saved successfully.", "saved": True}

@router.delete("/{opportunity_id}")
def remove_saved_opportunity(
    opportunity_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    saved = db.query(SavedOpportunity).filter(
        SavedOpportunity.student_id == profile.id,
        SavedOpportunity.opportunity_id == opportunity_id
    ).first()

    if not saved:
        return {"message": "Opportunity was not saved.", "saved": False}

    db.delete(saved)
    db.commit()
    return {"message": "Opportunity removed from saved list.", "saved": False}
