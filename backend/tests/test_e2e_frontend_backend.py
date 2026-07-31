import os
import io
import json
import pytest
from PIL import Image
from fastapi.testclient import TestClient
from app.main import app
from app.database.session import Base, engine, SessionLocal
from app.services.market_service import seed_market_data
from app.services.community_service import seed_community_data

client = TestClient(app)

@pytest.fixture(scope="module", autouse=True)
def setup_e2e():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_market_data(db)
        seed_community_data(db)
    finally:
        db.close()

def test_e2e_full_user_flow():
    print("\n--- Starting E2E Frontend-Backend Integration Loop Verification ---")

    # 1. Health Check
    health = client.get("/health").json()
    assert health["status"] == "ok"
    print("1. [PASS] Health check ok")

    # 2. Registration & Authentication
    reg_res = client.post("/auth/register", json={
        "name": "E2E Farmer",
        "phone": "9911223344",
        "password": "pass123word",
        "location": "Bangalore",
        "preferred_language": "en"
    })
    assert reg_res.status_code == 201
    token = reg_res.json()["token"]
    headers = {"Authorization": f"Bearer {token}"}
    print("2. [PASS] User registration & JWT auth issued")

    # 3. Crop Leaf Image Upload & AI Disease Detection
    img = Image.new("RGB", (224, 224), color="green")
    img_byte_arr = io.BytesIO()
    img.save(img_byte_arr, format="JPEG")
    
    diag_res = client.post(
        "/crop/diagnose",
        headers=headers,
        files={"image": ("tomato_leaf.jpg", img_byte_arr.getvalue(), "image/jpeg")},
        data={"crop_hint": "Tomato"}
    )
    assert diag_res.status_code == 201
    diag = diag_res.json()
    diag_id = diag["diagnosis_id"]
    assert diag["crop"] == "Tomato"
    assert "disease" in diag
    assert "yield_loss" in diag
    print(f"3. [PASS] AI Disease Detection: Detected '{diag['disease']}' on Tomato with {diag['confidence']*100}% confidence")

    # 4. Weather Intelligence
    weather_res = client.get("/weather?location=Bangalore", headers=headers)
    assert weather_res.status_code == 200
    weather = weather_res.json()
    assert weather["location"] == "Bangalore"
    assert "weather_risk" in weather
    print(f"4. [PASS] Weather Intelligence: Weather risk assessed as '{weather['weather_risk']}'")

    # 5. Market Price History & 7-Day Regression Prediction
    mkt_res = client.get("/market/tomato?days=30", headers=headers)
    assert mkt_res.status_code == 200
    mkt = mkt_res.json()
    assert len(mkt["historical_prices"]) > 0

    pred_res = client.get("/market/tomato/prediction", headers=headers)
    assert pred_res.status_code == 200
    pred = pred_res.json()
    assert pred["trend"] in ["rising", "falling", "stable"]
    print(f"5. [PASS] Market Price Prediction: Current ₹{mkt['current_price']}/kg, 7-Day Prediction ₹{pred['predicted_price_7d']}/kg ({pred['trend']} trend)")

    # 6. Smart Sell/Hold Decision Advisor Engine
    rec_res = client.post(
        "/recommendation",
        headers=headers,
        json={
            "diagnosis_id": diag_id,
            "crop": "tomato",
            "location": "Bangalore",
            "affected_area_pct": 20.0
        }
    )
    assert rec_res.status_code == 201
    rec = rec_res.json()
    assert rec["decision"] in ["SELL", "HOLD", "SELL_PARTIALLY"]
    print(f"6. [PASS] Sell/Hold Decision Engine: Recommendation is '{rec['decision']}' with reasoning: '{rec['reason'][:60]}...'")

    # 7. AI Multilingual Chatbot (English & Hindi)
    chat_en = client.post(
        "/chat",
        headers=headers,
        json={"message": "What fungicide should I spray for early blight?", "diagnosis_id": diag_id, "language": "en"}
    )
    assert chat_en.status_code == 200
    assert len(chat_en.json()["reply"]) > 10

    chat_hi = client.post(
        "/chat",
        headers=headers,
        json={"message": "अर्ली ब्लाइट का इलाज कैसे करें?", "diagnosis_id": diag_id, "language": "hi"}
    )
    assert chat_hi.status_code == 200
    assert len(chat_hi.json()["reply"]) > 10
    print("7. [PASS] AI Multilingual Chatbot (English & Hindi) verified")

    # 8. Community Q&A Forum
    posts_res = client.get("/community/posts", headers=headers)
    assert posts_res.status_code == 200
    posts = posts_res.json()
    assert posts["total"] >= 5

    post_detail = client.get(f"/community/posts/{posts['posts'][0]['post_id']}", headers=headers).json()
    assert len(post_detail["answers"]) > 0
    print(f"8. [PASS] Community Q&A: Pre-seeded posts verified ({posts['total']} discussions live)")

    print("--- E2E Integration Loop Completed Successfully! ---")
