from fastapi import APIRouter, Depends, Query
from app.schemas.weather import WeatherResponse
from app.services.weather_service import fetch_weather
from app.database.models import User
from app.utils.security import get_current_user

router = APIRouter(prefix="/weather", tags=["Weather"])

@router.get("", response_model=WeatherResponse)
def get_weather(
    location: str = Query("Bangalore", description="City or district name"),
    current_user: User = Depends(get_current_user)
):
    weather_data = fetch_weather(location=location)
    return weather_data
