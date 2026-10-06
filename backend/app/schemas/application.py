from pydantic import BaseModel, ConfigDict
from typing import Optional, Dict, Any
from datetime import datetime
from app.schemas.opportunity import OpportunityResponse

class ApplicationCreate(BaseModel):
    opportunity_id: int
    status: str = "Applied"  # Interested, Applied, Shortlisted, Selected, Rejected
    notes: Optional[str] = None

class ApplicationUpdate(BaseModel):
    status: str
    notes: Optional[str] = None

class ApplicationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    opportunity_id: int
    status: str
    notes: Optional[str] = None
    applied_at: Optional[datetime] = None
    opportunity: Optional[OpportunityResponse] = None

class SavedOpportunityResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    student_id: int
    opportunity_id: int
    created_at: Optional[datetime] = None
    opportunity: Optional[OpportunityResponse] = None
    match_score: Optional[float] = None
