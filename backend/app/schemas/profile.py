from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class SkillBase(BaseModel):
    name: str

class SkillResponse(SkillBase):
    model_config = ConfigDict(from_attributes=True)
    id: int

class ProjectBase(BaseModel):
    title: str
    description: str
    technologies: str = ""

class ProjectCreate(ProjectBase):
    pass

class ProjectResponse(ProjectBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    student_id: int

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    college: Optional[str] = None
    branch: Optional[str] = None
    year: Optional[int] = None
    experience_level: Optional[str] = None
    work_experience: Optional[str] = None
    skills: Optional[List[str]] = None
    interests: Optional[List[str]] = None
    career_preferences: Optional[List[str]] = None

class ProfileResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    name: str
    email: str
    college: str
    branch: str
    year: int
    experience_level: str
    work_experience: Optional[str] = None
    skills: List[str] = []
    interests: List[str] = []
    career_preferences: List[str] = []
    projects: List[ProjectResponse] = []
    updated_at: Optional[datetime] = None
