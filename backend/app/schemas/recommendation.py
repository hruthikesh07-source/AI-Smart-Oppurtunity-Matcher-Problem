from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.schemas.opportunity import OpportunityResponse

class ScoreBreakdown(BaseModel):
    final_score: float
    rule_score: float
    skill_score: float
    interest_score: float
    branch_score: float
    experience_score: float
    eligibility_score: float
    nlp_score: float

class RecommendationResponse(BaseModel):
    opportunity_id: int
    match_score: float
    score_breakdown: Optional[ScoreBreakdown] = None
    matched_skills: List[str] = []
    missing_skills: List[str] = []
    explanation: List[str] = []
    opportunity: OpportunityResponse

class SkillGapItem(BaseModel):
    skill: str
    demand_count: int
    impact_statement: str
    related_opportunities: List[str] = []

class SkillGapResponse(BaseModel):
    skills_have: List[str] = []
    skills_to_improve: List[SkillGapItem] = []
    total_gap_count: int
    top_recommendation: str
