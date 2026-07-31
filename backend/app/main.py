import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.database.session import init_db, SessionLocal
from app.services.market_service import seed_market_data
from app.services.community_service import seed_community_data

from app.routes.auth import router as auth_router
from app.routes.crop import router as crop_router
from app.routes.weather import router as weather_router
from app.routes.market import router as market_router
from app.routes.recommendation import router as recommendation_router
from app.routes.chat import router as chat_router
from app.routes.community import router as community_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables
    print("Initializing Database tables...")
    init_db()
    
    # Seed initial market prices and community Q&A
    db = SessionLocal()
    try:
        seed_market_data(db)
        seed_community_data(db)
    finally:
        db.close()
        
    yield
    print("Shutting down AgriSense API service.")

app = FastAPI(
    title="AgriSense API — AI Farm Companion",
    description="Backend API for crop disease detection, market price prediction, weather intelligence, sell/hold advisor, and AI chat.",
    version="1.0.0",
    lifespan=lifespan
)

# CORS middleware for React / Flutter / Mobile integration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount uploads directory for static image serving
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth_router)
app.include_router(crop_router)
app.include_router(weather_router)
app.include_router(market_router)
app.include_router(recommendation_router)
app.include_router(chat_router)
app.include_router(community_router)

@app.get("/health", tags=["Health"])
def health_check():
    return {
        "status": "ok",
        "version": "1.0.0",
        "services": {
            "database": "connected",
            "disease_model": "active",
            "market_prediction": "active",
            "weather_api": "active",
            "ai_chatbot": "active",
            "community_qa": "active"
        }
    }
