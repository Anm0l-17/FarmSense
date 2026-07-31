import uuid
import json
from datetime import datetime
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from app.database.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"

    user_id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(100), nullable=False)
    phone = Column(String(20), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    location = Column(String(100), nullable=False, default="Bangalore")
    preferred_language = Column(String(10), nullable=False, default="en")
    created_at = Column(DateTime, default=datetime.utcnow)

    diagnoses = relationship("CropDiagnosis", back_populates="user")
    community_posts = relationship("CommunityPost", back_populates="user")
    community_answers = relationship("CommunityAnswer", back_populates="user")

class CropDiagnosis(Base):
    __tablename__ = "crop_diagnoses"

    diagnosis_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False)
    crop = Column(String(50), nullable=False)
    disease = Column(String(100), nullable=False)
    confidence = Column(Float, nullable=False)
    severity = Column(String(20), nullable=False)
    image_url = Column(String(255), nullable=True)
    yield_loss = Column(Float, default=18.0)
    description = Column(Text, nullable=True)
    symptoms_json = Column(Text, nullable=True)
    actions_json = Column(Text, nullable=True)
    revenue_impact_json = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="diagnoses")
    recommendations = relationship("Recommendation", back_populates="diagnosis")

    @property
    def symptoms(self):
        return json.loads(self.symptoms_json) if self.symptoms_json else ["Dark brown spots with concentric rings"]

    @property
    def actions(self):
        return json.loads(self.actions_json) if self.actions_json else ["Remove infected lower leaves", "Apply fungicide spray"]

    @property
    def revenue_impact(self):
        return json.loads(self.revenue_impact_json) if self.revenue_impact_json else [4500, 8000]

class Recommendation(Base):
    __tablename__ = "recommendations"

    recommendation_id = Column(String(36), primary_key=True, default=generate_uuid)
    diagnosis_id = Column(String(36), ForeignKey("crop_diagnoses.diagnosis_id"), nullable=False)
    current_price = Column(Float, nullable=False)
    predicted_price = Column(Float, nullable=False)
    weather_risk = Column(String(20), nullable=False)
    yield_loss = Column(Float, nullable=False)
    decision = Column(String(20), nullable=False)  # SELL, HOLD, SELL_PARTIALLY
    reason = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    diagnosis = relationship("CropDiagnosis", back_populates="recommendations")

class MarketPrice(Base):
    __tablename__ = "market_prices"

    price_id = Column(String(36), primary_key=True, default=generate_uuid)
    crop = Column(String(50), nullable=False, index=True)
    market = Column(String(100), nullable=False, default="Local Mandi")
    location = Column(String(100), nullable=False, default="Bangalore")
    price = Column(Float, nullable=False)
    date = Column(DateTime, nullable=False, index=True)

class WeatherCache(Base):
    __tablename__ = "weather_cache"

    weather_id = Column(String(36), primary_key=True, default=generate_uuid)
    location = Column(String(100), nullable=False, index=True)
    temperature = Column(Float, nullable=False)
    humidity = Column(Integer, nullable=False)
    rain_probability = Column(Float, nullable=False)
    data_json = Column(Text, nullable=True)
    fetched_at = Column(DateTime, default=datetime.utcnow)

class CommunityPost(Base):
    __tablename__ = "community_posts"

    post_id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=False)
    crop = Column(String(50), nullable=False)
    question = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="community_posts")
    answers = relationship("CommunityAnswer", back_populates="post")

class CommunityAnswer(Base):
    __tablename__ = "community_answers"

    answer_id = Column(String(36), primary_key=True, default=generate_uuid)
    post_id = Column(String(36), ForeignKey("community_posts.post_id"), nullable=False)
    user_id = Column(String(36), ForeignKey("users.user_id"), nullable=True)  # Null if AI
    answer = Column(Text, nullable=False)
    is_ai_generated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    post = relationship("CommunityPost", back_populates="answers")
    user = relationship("User", back_populates="community_answers")
