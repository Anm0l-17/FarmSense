from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.recommendation import RecommendationRequest, RecommendationResponse
from app.services.decision_service import generate_recommendation
from app.database.models import User
from app.utils.security import get_current_user

router = APIRouter(prefix="/recommendation", tags=["Recommendation Engine"])

@router.post("", response_model=RecommendationResponse, status_code=status.HTTP_201_CREATED)
def create_recommendation(
    req: RecommendationRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    try:
        rec = generate_recommendation(
            db=db,
            diagnosis_id=req.diagnosis_id,
            crop=req.crop,
            location=req.location,
            affected_area_pct=req.affected_area_pct or 10.0
        )
        return rec
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to generate recommendation: {str(e)}"
        )
