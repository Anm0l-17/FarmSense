from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.schemas.market import MarketPriceResponse, PredictionResponse
from app.services.market_service import get_market_data
from app.services.prediction_service import predict_crop_prices
from app.database.models import User
from app.utils.security import get_current_user

router = APIRouter(prefix="/market", tags=["Market Intelligence"])

@router.get("/{crop}", response_model=MarketPriceResponse)
def get_crop_market_data(
    crop: str,
    days: int = Query(30, ge=1, le=365),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    data = get_market_data(db=db, crop=crop, days=days)
    return data

@router.get("/{crop}/prediction", response_model=PredictionResponse)
def get_crop_price_prediction(
    crop: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    prediction = predict_crop_prices(db=db, crop=crop)
    return prediction
