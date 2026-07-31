from pydantic import BaseModel
from typing import Optional

class ChatRequest(BaseModel):
    message: str
    diagnosis_id: Optional[str] = None
    language: Optional[str] = "en"

class ChatResponse(BaseModel):
    reply: str
    language: str
