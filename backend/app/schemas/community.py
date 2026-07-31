from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class AnswerCreate(BaseModel):
    answer: str

class AnswerResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    answer_id: str
    user_name: Optional[str] = "AgriSense AI"
    answer: str
    is_ai_generated: bool
    created_at: datetime

class PostCreate(BaseModel):
    crop: str
    question: str

class PostSummaryResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    post_id: str
    user_name: str
    crop: str
    question: str
    answer_count: int
    created_at: datetime

class PostListResponse(BaseModel):
    total: int
    posts: List[PostSummaryResponse]

class PostDetailResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    post_id: str
    user_name: str
    crop: str
    question: str
    answers: List[AnswerResponse]
    created_at: datetime

class PostCreateResponse(BaseModel):
    post_id: str
    crop: str
    question: str
    ai_answer: AnswerResponse
    created_at: datetime
