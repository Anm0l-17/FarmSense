# Base yield loss impact matrix by disease severity
SEVERITY_LOSS_MULTIPLIER = {
    "High": 0.50,       # Up to 50% loss if 100% field infected
    "Moderate": 0.25,   # Up to 25% loss
    "Low": 0.10,        # Up to 10% loss
    "None": 0.0         # 0% loss if healthy
}

CROP_PERISHABILITY_MAP = {
    "tomato": "high",
    "potato": "low",
    "rice": "very_low",
    "wheat": "very_low",
    "onion": "medium"
}

def estimate_yield_loss(crop: str, disease: str, severity: str, affected_area_pct: float = 10.0) -> dict:
    crop_lower = crop.lower()
    base_mult = SEVERITY_LOSS_MULTIPLIER.get(severity.capitalize(), 0.20)
    
    # Area percentage (0 to 100)
    area_factor = max(min(affected_area_pct, 100.0), 1.0) / 100.0
    
    estimated_loss = round(base_mult * area_factor * 100.0, 1)
    
    if estimated_loss > 30.0:
        urgency = "high"
    elif estimated_loss > 10.0:
        urgency = "medium"
    else:
        urgency = "low"
        
    perishability = CROP_PERISHABILITY_MAP.get(crop_lower, "medium")

    return {
        "estimated_yield_loss_pct": estimated_loss,
        "urgency": urgency,
        "perishability": perishability
    }
