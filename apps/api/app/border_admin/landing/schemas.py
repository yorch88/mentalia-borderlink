from pydantic import BaseModel, Field
from typing import List, Optional
from app.schemas.pow import PowIn


class Section(BaseModel):
    title: Optional[str] = None
    subtitle: Optional[str] = None
    description: Optional[str] = None
    text: Optional[str] = None
    url_image: Optional[str] = None


class Feature(BaseModel):
    title: str
    description: str
    url_image: Optional[str] = None


class SocialLinks(BaseModel):
    linkedin: Optional[str] = None
    facebook: Optional[str] = None


class FooterSection(BaseModel):
    text: Optional[str] = None
    url_image: Optional[str] = None
    socialLinks: Optional[SocialLinks] = None

class CookiePolicy(BaseModel):
    title: str
    updated_at: Optional[str] = None
    content: str

class Clause(BaseModel):
    title: str
    text: str

class TermsAndConditions(BaseModel):
    title: str
    updated_at: Optional[str] = None
    clauses: List[Clause] = Field(default_factory=list)

class LandingContent(BaseModel):
    hero: Section
    about: Section
    contact: Section
    privacy: Section
    footer: FooterSection
    features: List[Feature] = Field(default_factory=list)
    terms: Optional[TermsAndConditions] = None
    cookies: Optional[CookiePolicy] = None

class ContactIn(BaseModel):
    name: str
    email: str
    country_code: Optional[str] = None
    phone: Optional[str] = None
    message: str
    pow: PowIn
    accepted: bool = Field(default=False)