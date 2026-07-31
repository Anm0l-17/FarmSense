from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.llm_service import generate_ai_response
from app.database.models import User
from app.utils.security import get_current_user

router = APIRouter(prefix="/chat", tags=["AI Chatbot"])

@router.post("", response_model=ChatResponse)
def chat_with_companion(
    req: ChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_lang = req.language or current_user.preferred_language or "en"
    reply = generate_ai_response(
        message=req.message,
        diagnosis_id=req.diagnosis_id,
        language=user_lang,
        db=db
    )
    return ChatResponse(reply=reply, language=user_lang)
