from pydantic import BaseModel
from typing import List, Dict, Any

class SkillCount(BaseModel):
    name: str
    count: int

class OpportunityTypeCount(BaseModel):
    type: str
    count: int

class ApplicationStatusCount(BaseModel):
    status: str
    count: int

class AdminStatsResponse(BaseModel):
    total_students: int
    total_opportunities: int
    total_applications: int
    total_saved: int
    avg_match_score: float
    popular_skills: List[SkillCount]
    opportunity_types: List[OpportunityTypeCount]
    application_statuses: List[ApplicationStatusCount]
    recent_applications: List[Dict[str, Any]]
