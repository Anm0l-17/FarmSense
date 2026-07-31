# 📋 AgriSense — API Contract (Frontend ↔ Backend)

> **Base URL (local):** `http://localhost:8000`
> **Base URL (deployed):** `TBD — Render URL`
> **Content-Type:** `application/json` (unless noted otherwise)
> **Auth:** JWT Bearer token in `Authorization` header
> **API Docs:** `{BASE_URL}/docs` (auto-generated Swagger UI)

---

## 🔐 Authentication

All endpoints except `/health`, `/auth/register`, and `/auth/login` require authentication.

Send the JWT token as:
```
Authorization: Bearer <token>
```

---

### `POST /auth/register`

Create a new user account.

**Request:**
```json
{
    "name": "Raju Kumar",
    "phone": "9876543210",
    "password": "securepass123",
    "location": "Bangalore",
    "preferred_language": "en"
}
```

| Field | Type | Required | Notes |
|---|---|---|---|
| name | string | ✅ | Full name |
| phone | string | ✅ | Unique, used as login ID |
| password | string | ✅ | Min 6 characters |
| location | string | ✅ | City/district name |
| preferred_language | string | ❌ | `"en"`, `"hi"`, `"kn"`. Default: `"en"` |

**Response (201):**
```json
{
    "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Raju Kumar",
    "phone": "9876543210",
    "location": "Bangalore",
    "preferred_language": "en",
    "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### `POST /auth/login`

**Request:**
```json
{
    "phone": "9876543210",
    "password": "securepass123"
}
```

**Response (200):**
```json
{
    "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Raju Kumar",
    "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### `GET /auth/me`

🔒 **Requires Auth**

**Response (200):**
```json
{
    "user_id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "name": "Raju Kumar",
    "phone": "9876543210",
    "location": "Bangalore",
    "preferred_language": "en",
    "created_at": "2026-07-31T10:00:00Z"
}
```

---

## 🌿 Crop Diagnosis

### `POST /crop/diagnose`

🔒 **Requires Auth**

Upload a crop/leaf image for disease detection.

**Request:** `multipart/form-data`

| Field | Type | Required | Notes |
|---|---|---|---|
| image | file | ✅ | JPG/PNG, max 10MB |
| crop_hint | string | ❌ | Optional hint: `"tomato"`, `"potato"`, etc. |

**Response (200):**
```json
{
    "diagnosis_id": "d1e2f3a4-b5c6-7890-abcd-ef1234567890",
    "crop": "Tomato",
    "disease": "Early Blight",
    "confidence": 0.94,
    "severity": "High",
    "image_url": "/uploads/d1e2f3a4.jpg",
    "created_at": "2026-07-31T11:30:00Z"
}
```

---

### `GET /crop/history`

🔒 **Requires Auth**

Returns all past diagnoses for the current user.

---

## 🌤️ Weather

### `GET /weather`

🔒 **Requires Auth**

**Query Params:** `location` (default: `"Bangalore"`)

**Response (200):**
```json
{
    "location": "Bangalore",
    "current": {
        "temperature": 28.5,
        "humidity": 72,
        "rain_probability": 0.45,
        "wind_speed": 12.3,
        "description": "Partly cloudy"
    },
    "forecast": [
        {
            "date": "2026-08-01",
            "temperature_high": 30,
            "temperature_low": 22,
            "humidity": 68,
            "rain_probability": 0.30,
            "description": "Sunny"
        }
    ],
    "weather_risk": "moderate",
    "fetched_at": "2026-07-31T12:00:00Z"
}
```

---

## 📊 Market Prices

### `GET /market/{crop}`

Get current and historical prices.

---

### `GET /market/{crop}/prediction`

Get 7-day price prediction.

---

## 🤖 Recommendation (Sell/Hold Advisor)

### `POST /recommendation`

🔒 **Requires Auth**

**Request:**
```json
{
    "diagnosis_id": "d1e2f3a4-b5c6-7890-abcd-ef1234567890",
    "crop": "tomato",
    "location": "Bangalore",
    "affected_area_pct": 30
}
```

**Response (200):**
```json
{
    "recommendation_id": "r1e2f3a4-b5c6-7890-abcd-ef1234567890",
    "decision": "HOLD",
    "reason": "Tomato prices are expected to rise 9.5% over the next 7 days (₹28.50 → ₹31.20)...",
    "details": {
        "crop": "Tomato",
        "disease": "Early Blight",
        "severity": "High",
        "current_price": 28.50,
        "predicted_price": 31.20,
        "price_trend": "rising",
        "weather_risk": "moderate",
        "yield_loss_pct": 8.0,
        "perishability": "high"
    },
    "created_at": "2026-07-31T14:00:00Z"
}
```

---

## 💬 AI Chat

### `POST /chat`

🔒 **Requires Auth**

**Request:**
```json
{
    "message": "What should I do about early blight on my tomatoes?",
    "diagnosis_id": "d1e2f3a4-b5c6-7890-abcd-ef1234567890",
    "language": "en"
}
```

*(Languages supported: `"en"`, `"hi"`, `"kn"`)*

---

## 👥 Community Q&A (Pre-Seeded)

The database comes pre-loaded with **5 real discussions** across Tomato, Potato, Rice, Onion, and Wheat, featuring both **human farmer replies** and **AgriSense AI answers**.

### `GET /community/posts`

🔒 **Requires Auth**

List community questions.

**Query Params:** `crop`, `search`, `limit`, `offset`

---

### `GET /community/posts/{post_id}`

🔒 **Requires Auth**

Get single post with all human and AI answers.

---

### `POST /community/posts`

🔒 **Requires Auth**

Ask a new question. Automatically generates an AI answer upon posting!

---

### `POST /community/posts/{post_id}/answers`

🔒 **Requires Auth**

Add a human answer to any post.
