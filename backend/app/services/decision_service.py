from sqlalchemy.orm import Session
from app.services.weather_service import fetch_weather
from app.services.prediction_service import predict_crop_prices
from app.services.yield_service import estimate_yield_loss
from app.database.models import CropDiagnosis, Recommendation

def generate_recommendation(
    db: Session,
    diagnosis_id: str,
    crop: str,
    location: str = "Bangalore",
    affected_area_pct: float = 10.0
) -> Recommendation:
    # Fetch diagnosis if available
    diag = db.query(CropDiagnosis).filter(CropDiagnosis.diagnosis_id == diagnosis_id).first()
    disease = diag.disease if diag else "Unknown Issue"
    severity = diag.severity if diag else "Moderate"

    # Fetch weather and market prediction
    weather_data = fetch_weather(location=location)
    weather_risk = weather_data["weather_risk"]

    price_pred = predict_crop_prices(db=db, crop=crop)
    current_price = price_pred["current_price"]
    predicted_price = price_pred["predicted_price_7d"]
    price_trend = price_pred["trend"]
    price_change_pct = price_pred["price_change_pct"]

    yield_data = estimate_yield_loss(
        crop=crop,
        disease=disease,
        severity=severity,
        affected_area_pct=affected_area_pct
    )
    yield_loss_pct = yield_data["estimated_yield_loss_pct"]
    perishability = yield_data["perishability"]

    # Rule-Based Decision Logic
    decision = "HOLD"
    reasons = []

    if perishability == "high" and severity == "High":
        decision = "SELL"
        reasons.append(f"{crop.capitalize()} is highly perishable and disease severity is high.")
    elif weather_risk == "high" and perishability in ["high", "medium"]:
        decision = "SELL"
        reasons.append(f"Heavy rainfall expected in {location}, posing high risk for harvested crops.")
    elif price_change_pct > 5.0 and severity != "High" and weather_risk != "high":
        decision = "HOLD"
        reasons.append(f"Market price is projected to rise by {price_change_pct}% over the next 7 days (₹{current_price} → ₹{predicted_price}/kg).")
    elif price_change_pct < -5.0:
        decision = "SELL"
        reasons.append(f"Market prices are falling ({price_change_pct}% forecast in 7 days). Selling now locks in current peak price.")
    elif severity == "Moderate" and yield_loss_pct > 15.0:
        decision = "SELL_PARTIALLY"
        reasons.append(f"Moderate disease spread causing estimated {yield_loss_pct}% yield loss. Recommend selling current stock while holding healthy portion.")
    else:
        decision = "HOLD"
        reasons.append(f"Favorable conditions with price trend {price_trend} and manageable crop health risk.")

    reason_str = " ".join(reasons) + f" Recommendation: {decision.replace('_', ' ')}."

    # Save to database
    db_rec = Recommendation(
        diagnosis_id=diagnosis_id,
        current_price=current_price,
        predicted_price=predicted_price,
        weather_risk=weather_risk,
        yield_loss=yield_loss_pct,
        decision=decision,
        reason=reason_str
    )
    db.add(db_rec)
    db.commit()
    db.refresh(db_rec)

    # Attach transient details for API response
    db_rec.details = {
        "crop": crop.capitalize(),
        "disease": disease,
        "severity": severity,
        "current_price": current_price,
        "predicted_price": predicted_price,
        "price_trend": price_trend,
        "weather_risk": weather_risk,
        "yield_loss_pct": yield_loss_pct,
        "perishability": perishability
    }

    return db_rec
