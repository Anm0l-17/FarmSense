from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class UserRegister(BaseModel):
    name: str
    phone: str
    password: str
    location: Optional[str] = "Bangalore"
    preferred_language: Optional[str] = "en"

class UserLogin(BaseModel):
    phone: str
    password: str

class TokenResponse(BaseModel):
    user_id: str
    name: str
    phone: Optional[str] = None
    location: Optional[str] = "Bangalore"
    preferred_language: Optional[str] = "en"
    token: str

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: str
    name: str
    phone: str
    location: str
    preferred_language: str
    created_at: datetime
