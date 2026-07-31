import math
import random
from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database.models import MarketPrice

BASE_CROP_PRICES = {
    "tomato": {"base": 28.0, "amplitude": 8.0, "freq": 365 / 2},
    "potato": {"base": 20.0, "amplitude": 4.0, "freq": 365},
    "rice": {"base": 42.0, "amplitude": 3.0, "freq": 365},
    "wheat": {"base": 26.0, "amplitude": 2.5, "freq": 365},
    "onion": {"base": 32.0, "amplitude": 12.0, "freq": 365 / 3},
}

def seed_market_data(db: Session):
    existing_count = db.query(MarketPrice).count()
    if existing_count > 0:
        return

    print("Seeding 365 days of realistic crop market prices...")
    today = datetime.utcnow().date()
    records = []

    for crop_key, params in BASE_CROP_PRICES.items():
        crop_title = crop_key.capitalize()
        base_price = params["base"]
        amp = params["amplitude"]
        freq = params["freq"]

        for d in range(365, -1, -1):
            date_val = datetime.combine(today - timedelta(days=d), datetime.min.time())
            
            # Seasonal sine wave + drift + random noise
            day_idx = 365 - d
            seasonal = amp * math.sin(2 * math.pi * day_idx / freq)
            noise = random.uniform(-1.5, 1.5)
            drift = (day_idx / 365.0) * 2.0  # slight general inflation
            
            price = round(max(base_price + seasonal + noise + drift, 10.0), 2)

            records.append(MarketPrice(
                crop=crop_title,
                market="Local Mandi",
                location="Bangalore",
                price=price,
                date=date_val
            ))

    db.bulk_save_objects(records)
    db.commit()
    print(f"Market prices seeded successfully ({len(records)} entries).")

def get_market_data(db: Session, crop: str, days: int = 30) -> dict:
    crop_title = crop.strip().capitalize()
    
    # Query prices sorted by date
    records = db.query(MarketPrice).filter(
        MarketPrice.crop == crop_title
    ).order_by(MarketPrice.date.desc()).limit(days).all()

    if not records:
        # Fallback if crop not seeded
        records = db.query(MarketPrice).filter(
            MarketPrice.crop == "Tomato"
        ).order_by(MarketPrice.date.desc()).limit(days).all()
        crop_title = "Tomato"

    records.reverse()  # Chronological order
    
    current_price = records[-1].price if records else 28.5
    yesterday_price = records[-2].price if len(records) > 1 else current_price
    
    change_pct = round(((current_price - yesterday_price) / yesterday_price) * 100, 2)

    history = [
        {"date": r.date.strftime("%Y-%m-%d"), "price": r.price}
        for r in records
    ]

    return {
        "crop": crop_title,
        "current_price": current_price,
        "yesterday_price": yesterday_price,
        "price_change_pct": change_pct,
        "unit": "₹/kg",
        "historical_prices": history
    }
