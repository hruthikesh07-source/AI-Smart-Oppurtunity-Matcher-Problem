from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class Opportunity(Base):
    __tablename__ = "opportunities"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(200), nullable=False, index=True)
    organization = Column(String(150), nullable=False, index=True)
    type = Column(String(50), nullable=False, index=True)  # Internship, Hackathon, Workshop, Competition, Certification
    description = Column(Text, nullable=False)
    required_skills = Column(Text, default="[]")  # JSON string array
    preferred_skills = Column(Text, default="[]")  # JSON string array
    eligible_branches = Column(Text, default="[\"All\"]")  # JSON string array e.g. ["CSE", "IT"]
    minimum_year = Column(Integer, default=1)
    maximum_year = Column(Integer, default=4)
    experience_required = Column(String(50), default="Beginner")  # None, Beginner, Intermediate, Advanced
    location = Column(String(100), default="Remote")
    mode = Column(String(50), default="Online")  # Online, Offline, Hybrid
    deadline = Column(String(50), nullable=False)  # ISO Date YYYY-MM-DD
    apply_url = Column(String(500), default="https://example.com/apply")
    is_demo = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    saved_by = relationship("SavedOpportunity", back_populates="opportunity", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="opportunity", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="opportunity", cascade="all, delete-orphan")
