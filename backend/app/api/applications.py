from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.profile import StudentProfile
from app.models.opportunity import Opportunity
from app.models.application import Application, SavedOpportunity
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationResponse
from app.services.auth import get_current_user
from app.api.opportunities import parse_opp_dict, get_student_profile_dict
from app.ai.matcher import OpportunityMatcher

router = APIRouter(prefix="/applications", tags=["Applications"])

@router.get("", response_model=List[ApplicationResponse])
def get_applications(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        return []

    apps = db.query(Application).filter(Application.student_id == profile.id).order_by(Application.applied_at.desc()).all()
    if not apps:
        return []

    student_data = get_student_profile_dict(profile)
    saved_ids = {s[0] for s in db.query(SavedOpportunity.opportunity_id).filter(SavedOpportunity.student_id == profile.id).all()}

    results = []
    for app in apps:
        opp = app.opportunity
        opp_data = parse_opp_dict(opp)
        match_res = OpportunityMatcher.match_student_with_opportunity(student_data, opp_data)

        opp_data["match_score"] = match_res["match_score"]
        opp_data["score_breakdown"] = match_res["score_breakdown"]
        opp_data["matched_skills"] = match_res["matched_skills"]
        opp_data["missing_skills"] = match_res["missing_skills"]
        opp_data["explanation"] = match_res["explanation"]
        opp_data["is_saved"] = opp.id in saved_ids
        opp_data["application_status"] = app.status

        results.append({
            "id": app.id,
            "student_id": app.student_id,
            "opportunity_id": app.opportunity_id,
            "status": app.status,
            "notes": app.notes,
            "applied_at": app.applied_at,
            "opportunity": opp_data
        })

    return results

@router.post("", response_model=ApplicationResponse)
def create_or_update_application(
    app_in: ApplicationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    opp = db.query(Opportunity).filter(Opportunity.id == app_in.opportunity_id).first()
    if not opp:
        raise HTTPException(status_code=404, detail="Opportunity not found.")

    existing = db.query(Application).filter(
        Application.student_id == profile.id,
        Application.opportunity_id == app_in.opportunity_id
    ).first()

    if existing:
        existing.status = app_in.status
        if app_in.notes is not None:
            existing.notes = app_in.notes
        db.commit()
        db.refresh(existing)
        target_app = existing
    else:
        new_app = Application(
            student_id=profile.id,
            opportunity_id=app_in.opportunity_id,
            status=app_in.status,
            notes=app_in.notes
        )
        db.add(new_app)
        db.commit()
        db.refresh(new_app)
        target_app = new_app

    opp_data = parse_opp_dict(opp)
    opp_data["application_status"] = target_app.status

    return {
        "id": target_app.id,
        "student_id": target_app.student_id,
        "opportunity_id": target_app.opportunity_id,
        "status": target_app.status,
        "notes": target_app.notes,
        "applied_at": target_app.applied_at,
        "opportunity": opp_data
    }

@router.put("/{id}", response_model=ApplicationResponse)
def update_application(
    id: int,
    app_update: ApplicationUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    app = db.query(Application).filter(Application.id == id, Application.student_id == profile.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application record not found.")

    app.status = app_update.status
    if app_update.notes is not None:
        app.notes = app_update.notes

    db.commit()
    db.refresh(app)

    opp_data = parse_opp_dict(app.opportunity)
    opp_data["application_status"] = app.status

    return {
        "id": app.id,
        "student_id": app.student_id,
        "opportunity_id": app.opportunity_id,
        "status": app.status,
        "notes": app.notes,
        "applied_at": app.applied_at,
        "opportunity": opp_data
    }

@router.delete("/{id}")
def delete_application(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    profile = db.query(StudentProfile).filter(StudentProfile.user_id == current_user.id).first()
    if not profile:
        raise HTTPException(status_code=404, detail="Student profile not found.")

    app = db.query(Application).filter(Application.id == id, Application.student_id == profile.id).first()
    if not app:
        raise HTTPException(status_code=404, detail="Application record not found.")

    db.delete(app)
    db.commit()
    return {"message": "Application removed."}
