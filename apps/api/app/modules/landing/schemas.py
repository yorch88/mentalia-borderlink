from pydantic import BaseModel
from typing import List, Optional
from app.schemas.pow import PowIn

class Feature(BaseModel):
    title: str
    description: str

class SocialLinks(BaseModel):
    linkedin: Optional[str] = None
    facebook: Optional[str] = None

class LandingContent(BaseModel):
    heroTitle: str
    heroSubtitle: str
    aboutTitle: Optional[str] = None
    aboutDescription: Optional[str] = None
    features: List[Feature] = []
    contactTitle: Optional[str] = None
    contactSubtitle: Optional[str] = None
    privacyText: Optional[str] = None
    footerText: Optional[str] = None
    socialLinks: Optional[SocialLinks] = None


class ContactIn(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    message: str
    pow: PowIn