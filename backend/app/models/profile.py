from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime, Table
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

# Association table between student profiles and skills
student_skills = Table(
    "student_skills",
    Base.metadata,
    Column("student_id", Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), primary_key=True),
    Column("skill_id", Integer, ForeignKey("skills.id", ondelete="CASCADE"), primary_key=True)
)

class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)

    profiles = relationship("StudentProfile", secondary=student_skills, back_populates="skills")


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    college = Column(String(200), default="Demo Engineering College")
    branch = Column(String(50), default="CSE")  # CSE, IT, AIML, Data Science, ECE, EEE, Mechanical, Civil, Other
    year = Column(Integer, default=3)  # 1, 2, 3, 4
    experience_level = Column(String(30), default="Intermediate")  # Beginner, Intermediate, Advanced
    work_experience = Column(Text, nullable=True)  # Past internships / projects
    interests = Column(Text, default="[]")  # JSON string array of interests
    career_preferences = Column(Text, default="[]")  # JSON string array of opportunity types
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="profile")
    skills = relationship("Skill", secondary=student_skills, back_populates="profiles", lazy="joined")
    projects = relationship("Project", back_populates="profile", cascade="all, delete-orphan", lazy="joined")
    saved_opportunities = relationship("SavedOpportunity", back_populates="profile", cascade="all, delete-orphan")
    applications = relationship("Application", back_populates="profile", cascade="all, delete-orphan")
    recommendations = relationship("Recommendation", back_populates="profile", cascade="all, delete-orphan")


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("student_profiles.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)
    technologies = Column(String(300), default="")

    profile = relationship("StudentProfile", back_populates="projects")
