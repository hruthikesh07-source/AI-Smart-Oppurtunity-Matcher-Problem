from sqlalchemy import Column, Integer, Float, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    opportunity_id = Column(Integer, ForeignKey("opportunities.id", ondelete="CASCADE"), nullable=False)
    
    match_score = Column(Float, default=0.0)
    skill_score = Column(Float, default=0.0)
    interest_score = Column(Float, default=0.0)
    branch_score = Column(Float, default=0.0)
    experience_score = Column(Float, default=0.0)
    eligibility_score = Column(Float, default=0.0)
    nlp_score = Column(Float, default=0.0)
    
    explanation = Column(Text, default="[]")  # JSON list of explanation points
    skills_matched = Column(Text, default="[]")  # JSON list of matched skills
    skills_missing = Column(Text, default="[]")  # JSON list of missing skills
    
    created_at = Column(DateTime, default=datetime.utcnow)

    profile = relationship("StudentProfile", back_populates="recommendations")
    opportunity = relationship("Opportunity", back_populates="recommendations")
