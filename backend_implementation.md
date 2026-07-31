# 👨‍💻 Person 2 Roadmap (Backend + AI/ML + Database)

> **Role:** Backend Developer + AI/ML Engineer
>
> **Objective:** Build the complete backend infrastructure, AI services, database, and integrate external APIs for the AI Farm Companion.

---

# 📌 Responsibilities

You are responsible for:

- FastAPI Backend
- PostgreSQL Database
- Crop Disease Detection
- Market Price Prediction
- Yield Loss Estimation
- Weather API Integration
- AI Chatbot (LLM)
- Multilingual Support
- Decision Engine
- API Documentation
- Backend Testing

---

# 🗓️ Phase 1 - Project Setup (Day 1)

## 1. Clone Repository

```bash
git clone <repository-url>

cd ai-farm-companion
```

Create your own branch.

```bash
git checkout develop

git checkout -b feature/backend
```

---

## 2. Create Backend Structure

```
backend/
│
├── app/
│   ├── main.py
│   │
│   ├── routes/
│   │   ├── auth.py
│   │   ├── crop.py
│   │   ├── chat.py
│   │   ├── weather.py
│   │   ├── market.py
│   │   ├── recommendation.py
│   │   └── community.py
│   │
│   ├── services/
│   │   ├── disease_service.py
│   │   ├── llm_service.py
│   │   ├── market_service.py
│   │   ├── weather_service.py
│   │   ├── prediction_service.py
│   │   ├── yield_service.py
│   │   └── decision_service.py
│   │
│   ├── schemas/
│   │
│   ├── database/
│   │
│   └── utils/
│
├── tests/
│
└── requirements.txt
```

---

## 3. Install Dependencies

Suggested packages:

```
fastapi
uvicorn
sqlalchemy
alembic
psycopg2-binary
pydantic
python-dotenv
requests
scikit-learn
pandas
numpy
opencv-python
pillow
torch
transformers
pytest
```

---

# 🗓️ Phase 2 - Database (Day 1)

## Setup PostgreSQL

Create the following tables.

### users

```
user_id
name
phone
location
preferred_language
created_at
```

---

### crop_diagnoses

```
diagnosis_id
user_id
crop
disease
confidence
severity
image_url
created_at
```

---

### recommendations

```
recommendation_id
diagnosis_id
current_price
predicted_price
weather_risk
yield_loss
decision
reason
created_at
```

---

### market_prices

```
price_id
crop
market
location
price
date
```

---

### weather

```
weather_id
location
temperature
humidity
rain_probability
date
```

---

### community_posts

```
post_id
user_id
crop
question
created_at
```

---

### community_answers

```
answer_id
post_id
user_id
answer
is_ai_generated
created_at
```

---

Use

- SQLAlchemy
- Alembic

for ORM and migrations.

---

# 🗓️ Phase 3 - Backend API (Day 2)

Build the backend skeleton.

## Health Check

```
GET /health
```

Returns

```json
{
    "status":"ok"
}
```

---

## Authentication

```
POST /auth/register

POST /auth/login

GET /auth/me
```

---

## Crop Diagnosis

```
POST /crop/diagnose

GET /crop/history

GET /crop/{id}
```

---

## Weather

```
GET /weather
```

---

## Market

```
GET /market/{crop}

GET /market/{crop}/prediction
```

---

## Recommendation

```
POST /recommendation
```

---

## AI Chat

```
POST /chat
```

---

## Community

```
GET /community/posts

POST /community/posts

POST /community/posts/{id}/answers
```

---

# 🗓️ Phase 4 - Crop Disease Detection (Day 2-3)

Goal

Image → Disease

Pipeline

```
Image

↓

Disease Detection Model

↓

Disease

Confidence

Severity
```

Return format

```json
{
    "crop":"Tomato",
    "disease":"Early Blight",
    "confidence":0.94,
    "severity":"Moderate"
}
```

Save diagnosis into PostgreSQL.

---

# 🗓️ Phase 5 - Weather Integration (Day 3)

Connect Weather API.

Input

```
Location
```

Output

```
Temperature

Humidity

Rainfall

Rain Probability
```

Expose

```
GET /weather
```

---

# 🗓️ Phase 6 - Market Intelligence (Day 3)

Create

```
GET /market/{crop}
```

Return

```
Today's Price

Yesterday's Price

Historical Prices
```

Store price history in PostgreSQL.

---

# 🗓️ Phase 7 - Price Prediction (Day 4)

Pipeline

```
Historical Data

↓

Cleaning

↓

Regression / Time Series

↓

Future Price
```

Expose

```
GET /market/{crop}/prediction
```

Return

```json
{
    "current_price":24,
    "predicted_price":28
}
```

---

# 🗓️ Phase 8 - Yield Loss Estimation (Day 4)

Inputs

```
Crop

Disease

Severity

Affected Area
```

Output

```
Estimated Yield Loss (%)
```

Example

```
18%
```

Expose through recommendation service.

---

# 🗓️ Phase 9 - Decision Engine (Day 4)

This is the core logic.

Inputs

```
Disease Severity

Weather Risk

Current Price

Predicted Price

Yield Loss
```

Decision

```
SELL

HOLD

SELL PARTIALLY
```

Return

```json
{
    "decision":"HOLD",
    "reason":"Price expected to increase while disease risk remains moderate."
}
```

> **Important:** The decision should come from this rule-based engine—not directly from the LLM.

---

# 🗓️ Phase 10 - AI Chatbot (Day 5)

Use an LLM (Gemini/OpenAI/Ollama).

Provide context:

```
Disease

Severity

Weather

Market

Yield Loss

Decision
```

The chatbot should:

- Explain diseases
- Suggest remedies
- Answer farmer questions
- Explain recommendations

---

# 🗓️ Phase 11 - Multilingual Support (Day 5)

Support:

- English
- Hindi
- Kannada

Flow

```
Farmer Input

↓

Language Detection

↓

Translation

↓

LLM

↓

Translation

↓

Farmer
```

---

# 🗓️ Phase 12 - Community Q&A (Day 5)

Endpoints

```
GET /community/posts

POST /community/posts

POST /community/posts/{id}/answers
```

Allow AI-generated answers.

Database field

```
is_ai_generated = true
```

---

# 🗓️ Phase 13 - Testing (Day 6)

Use

```
pytest
```

Test

- API endpoints
- Disease service
- Decision engine
- Database CRUD
- Weather service
- Market service

---

## API Testing

Use Postman.

Test

- Register
- Login
- Diagnose
- Weather
- Market
- Recommendation
- Chat
- Community

Save the Postman Collection.

---

# 🗓️ Phase 14 - Integration (Day 6)

Connect backend with frontend.

Test complete flow.

```
Upload Image

↓

Disease Detection

↓

Save Diagnosis

↓

Weather

↓

Market

↓

Prediction

↓

Yield Loss

↓

Decision Engine

↓

LLM

↓

Frontend
```

---

# Git Workflow

Always work in your own branch.

Before starting

```bash
git checkout develop

git pull origin develop
```

Commit often

```bash
git add .

git commit -m "Implemented weather service"
```

Push

```bash
git push origin feature/backend
```

Create a Pull Request into `develop`.

---

# Deliverables

By the end of development, Person 2 should provide:

- ✅ Fully functional FastAPI backend
- ✅ PostgreSQL database with migrations
- ✅ Disease detection API
- ✅ Weather API integration
- ✅ Market price service
- ✅ Price prediction model
- ✅ Yield loss estimator
- ✅ Decision engine
- ✅ AI chatbot integration
- ✅ Multilingual support
- ✅ Community Q&A backend
- ✅ Unit tests
- ✅ Postman collection
- ✅ API documentation

---

# Final Backend Architecture

```
                React Frontend
                       │
                       │ REST API
                       ▼
                  FastAPI Backend
                       │
        ┌──────────────┼──────────────┐
        │              │              │
        ▼              ▼              ▼
 PostgreSQL       AI/ML Models     External APIs
        │              │              │
        │        Disease Model     Weather API
        │        Price Model       Market Data
        │        Yield Model
        │
        └──────────────┬──────────────┘
                       ▼
                Decision Engine
                       │
                       ▼
                  LLM (AI Agent)
                       │
                       ▼
                 JSON Response
                       │
                       ▼
                  React Frontend
```

> **Success Criteria:** The backend should be fully independent of the frontend. Any client (React app, mobile app, or future WhatsApp bot) should be able to consume the APIs without requiring backend changes.