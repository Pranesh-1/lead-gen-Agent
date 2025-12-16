from pydantic import BaseModel
from typing import Optional, List

class Person(BaseModel):
    id: str
    name: str
    title: str
    company: str
    location_person: str
    location_company: str
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin_url: Optional[str] = None
    avatar: Optional[str] = None

class CompanyMetadata(BaseModel):
    name: str
    funding_stage: Optional[str] = None # Series A, Series B, IPO, etc.
    uses_tech: bool = False # Already uses in-vitro/3D models
    open_to_nams: bool = False # Open to New Approach Methodologies
    is_hub: bool = False # Located in a Biotech Hub

class PersonMetadata(BaseModel):
    has_recent_paper: bool = False # Published in last 2 years
    paper_title: Optional[str] = None
    years_experience: int = 0

class EnrichedLead(BaseModel):
    person: Person
    company_meta: CompanyMetadata
    person_meta: PersonMetadata
    score: int = 0
    rank_reasons: List[str] = []
