from pydantic import BaseModel
from typing import List, Optional

class HistoricalPricePoint(BaseModel):
    date: str
    price: float

class DailyPredictionPoint(BaseModel):
    date: str
    predicted_price: float

class MarketPriceResponse(BaseModel):
    crop: str
    current_price: float
    yesterday_price: float
    price_change_pct: float
    unit: str = "₹/kg"
    historical_prices: List[HistoricalPricePoint]

class ModelInfo(BaseModel):
    algorithm: str
    training_days: int
    r2_score: float

class PredictionResponse(BaseModel):
    crop: str
    current_price: float
    predicted_price_7d: float
    trend: str
    price_change_pct: float
    daily_predictions: List[DailyPredictionPoint]
    model_info: ModelInfo
