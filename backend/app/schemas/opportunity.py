from pydantic import BaseModel, ConfigDict
from typing import List, Optional, Dict, Any
from datetime import datetime

class OpportunityBase(BaseModel):
    title: str
    organization: str
    type: str  # Internship, Hackathon, Workshop, Competition, Certification
    description: str
    required_skills: List[str] = []
    preferred_skills: List[str] = []
    eligible_branches: List[str] = ["All"]
    minimum_year: int = 1
    maximum_year: int = 4
    experience_required: str = "Beginner"  # None, Beginner, Intermediate, Advanced
    location: str = "Remote"
    mode: str = "Online"  # Online, Offline, Hybrid
    deadline: str  # YYYY-MM-DD
    apply_url: str = "https://example.com/apply"
    is_demo: bool = True

class OpportunityCreate(OpportunityBase):
    pass

class OpportunityUpdate(BaseModel):
    title: Optional[str] = None
    organization: Optional[str] = None
    type: Optional[str] = None
    description: Optional[str] = None
    required_skills: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    eligible_branches: Optional[List[str]] = None
    minimum_year: Optional[int] = None
    maximum_year: Optional[int] = None
    experience_required: Optional[str] = None
    location: Optional[str] = None
    mode: Optional[str] = None
    deadline: Optional[str] = None
    apply_url: Optional[str] = None
    is_demo: Optional[bool] = None

class OpportunityResponse(OpportunityBase):
    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: Optional[datetime] = None
    match_score: Optional[float] = None
    score_breakdown: Optional[Dict[str, float]] = None
    matched_skills: Optional[List[str]] = None
    missing_skills: Optional[List[str]] = None
    explanation: Optional[List[str]] = None
    is_saved: Optional[bool] = False
    application_status: Optional[str] = None
