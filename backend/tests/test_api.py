import os
import io
import uuid
import pytest
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import Base, engine, SessionLocal
from app.services.market_service import seed_market_data
from app.services.community_service import seed_community_data

@pytest.fixture(scope="session", autouse=True)
def setup_database():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_market_data(db)
        seed_community_data(db)
    finally:
        db.close()

client = TestClient(app)

@pytest.fixture
def auth_headers():
    phone = f"99{uuid.uuid4().hex[:8]}"
    password = "password123"
    client.post("/auth/register", json={
        "name": "Farmer Joe",
        "phone": phone,
        "password": password,
        "location": "Bangalore",
        "preferred_language": "en"
    })
    res = client.post("/auth/login", json={"phone": phone, "password": password})
    token = res.json()["token"]
    return {"Authorization": f"Bearer {token}"}

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "ok"
    assert "services" in data

def test_auth_flow():
    phone = f"98{uuid.uuid4().hex[:8]}"
    password = "pass123word"
    reg = client.post("/auth/register", json={
        "name": "Rajesh Patel",
        "phone": phone,
        "password": password,
        "location": "Mysore",
        "preferred_language": "hi"
    })
    assert reg.status_code == 201
    assert "token" in reg.json()

    login = client.post("/auth/login", json={"phone": phone, "password": password})
    assert login.status_code == 200
    assert login.json()["name"] == "Rajesh Patel"

def test_crop_diagnosis(auth_headers):
    img = Image.new("RGB", (224, 224), color="green")
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="JPEG")
    img_bytes = img_byte_arr.getvalue()

    response = client.post(
        "/crop/diagnose",
        headers=auth_headers,
        files={"image": ("test_leaf.jpg", img_bytes, "image/jpeg")},
        data={"crop_hint": "tomato"}
    )
    assert response.status_code == 201
    data = response.json()
    assert data["crop"] == "Tomato"
    assert "disease" in data
    assert "confidence" in data
    assert "diagnosis_id" in data

def test_weather_endpoint(auth_headers):
    res = client.get("/weather?location=Bangalore", headers=auth_headers)
    assert res.status_code == 200
    data = res.json()
    assert data["location"] == "Bangalore"
    assert "current" in data
    assert "forecast" in data
    assert "weather_risk" in data

def test_market_and_prediction(auth_headers):
    market_res = client.get("/market/tomato?days=30", headers=auth_headers)
    assert market_res.status_code == 200
    m_data = market_res.json()
    assert m_data["crop"] == "Tomato"
    assert len(m_data["historical_prices"]) > 0

    pred_res = client.get("/market/tomato/prediction", headers=auth_headers)
    assert pred_res.status_code == 200
    p_data = pred_res.json()
    assert p_data["trend"] in ["rising", "falling", "stable"]
    assert len(p_data["daily_predictions"]) == 7

def test_recommendation_engine(auth_headers):
    img = Image.new("RGB", (224, 224), color="green")
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="JPEG")
    
    diag_res = client.post(
        "/crop/diagnose",
        headers=auth_headers,
        files={"image": ("leaf.jpg", img_byte_arr.getvalue(), "image/jpeg")},
        data={"crop_hint": "tomato"}
    )
    diag_id = diag_res.json()["diagnosis_id"]

    rec_res = client.post(
        "/recommendation",
        headers=auth_headers,
        json={
            "diagnosis_id": diag_id,
            "crop": "tomato",
            "location": "Bangalore",
            "affected_area_pct": 25.0
        }
    )
    assert rec_res.status_code == 201
    rec_data = rec_res.json()
    assert rec_data["decision"] in ["SELL", "HOLD", "SELL_PARTIALLY"]
    assert "reason" in rec_data
    assert "details" in rec_data

def test_ai_chat(auth_headers):
    chat_res = client.post(
        "/chat",
        headers=auth_headers,
        json={
            "message": "What should I do to treat early blight on my tomato plants?",
            "language": "en"
        }
    )
    assert chat_res.status_code == 200
    assert len(chat_res.json()["reply"]) > 10

def test_community_qa(auth_headers):
    post_res = client.post(
        "/community/posts",
        headers=auth_headers,
        json={
            "crop": "Tomato",
            "question": "How often should I spray fungicide for early blight?"
        }
    )
    assert post_res.status_code == 201
    post_data = post_res.json()
    assert "post_id" in post_data
    assert post_data["ai_answer"]["is_ai_generated"] is True

    # List pre-seeded and new posts
    list_res = client.get("/community/posts", headers=auth_headers)
    assert list_res.status_code == 200
    # Should include 5 preseeded posts + 1 new post = 6 total
    assert list_res.json()["total"] >= 6
