from pydantic import BaseModel, ConfigDict
from typing import Optional
from datetime import datetime

class RecommendationRequest(BaseModel):
    diagnosis_id: str
    crop: str
    location: str = "Bangalore"
    affected_area_pct: Optional[float] = 10.0

class RecommendationDetails(BaseModel):
    crop: str
    disease: str
    severity: str
    current_price: float
    predicted_price: float
    price_trend: str
    weather_risk: str
    yield_loss_pct: float
    perishability: str

class RecommendationResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    recommendation_id: str
    decision: str  # SELL, HOLD, SELL_PARTIALLY
    reason: str
    details: RecommendationDetails
    created_at: datetime
