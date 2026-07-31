from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class CurrentWeather(BaseModel):
    temperature: float
    humidity: int
    rain_probability: float
    wind_speed: float
    description: str

class ForecastDay(BaseModel):
    date: str
    temperature_high: float
    temperature_low: float
    humidity: int
    rain_probability: float
    description: str

class WeatherResponse(BaseModel):
    location: str
    current: CurrentWeather
    forecast: List[ForecastDay]
    weather_risk: str
    fetched_at: datetime
