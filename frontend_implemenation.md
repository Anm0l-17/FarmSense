# 👩‍💻 Person 1 Roadmap (Frontend + Integration)

> **Role:** Frontend Developer + Integration Engineer
>
> **Objective:** Build a clean, responsive, farmer-friendly interface and integrate it with the backend APIs.

---

# 📌 Responsibilities

You are responsible for:

- React Frontend
- UI/UX Design
- Image Upload Interface
- AI Chat Interface
- Weather Dashboard
- Market Dashboard
- Recommendation Dashboard
- Community Q&A
- Multilingual UI
- API Integration
- Frontend Testing
- Final Demo & Deployment

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

git checkout -b feature/frontend
```

---

## 2. Create React Project

Use React + Vite.

```
frontend/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │
│   ├── pages/
│   │
│   ├── services/
│   │
│   ├── hooks/
│   │
│   ├── utils/
│   │
│   ├── App.jsx
│   └── main.jsx
│
├── package.json
└── vite.config.js
```

---

## 3. Install Dependencies

Suggested packages

```
react

react-router-dom

axios

tailwindcss

react-icons

react-toastify

framer-motion

react-hook-form
```

---

# 🗓️ Phase 2 - Project Structure (Day 1)

## Pages

Create

```
pages/

Home.jsx

Login.jsx

Register.jsx

Dashboard.jsx

Diagnose.jsx

DiagnosisResult.jsx

Chat.jsx

Market.jsx

Weather.jsx

Recommendation.jsx

Community.jsx

Profile.jsx

Settings.jsx
```

---

## Components

```
components/

Navbar.jsx

Sidebar.jsx

CropUploader.jsx

DiseaseCard.jsx

WeatherCard.jsx

MarketCard.jsx

RecommendationCard.jsx

ChatBox.jsx

MessageBubble.jsx

CommunityPost.jsx

AnswerCard.jsx

LanguageSelector.jsx

Loading.jsx

Footer.jsx
```

---

# 🗓️ Phase 3 - UI Design (Day 2)

Build the application layout.

```
Home

↓

Dashboard

↓

Diagnose Crop

↓

Result

↓

Weather

↓

Market

↓

Recommendation

↓

Community
```

The application should be simple enough for farmers to use.

---

# 🗓️ Phase 4 - Dashboard (Day 2)

Dashboard should display

```
Upload Crop

Latest Diagnosis

Today's Weather

Current Market Price

Latest Recommendation

Community Posts
```

---

# 🗓️ Phase 5 - Crop Diagnosis UI (Day 2)

Create

```
Diagnose.jsx
```

Workflow

```
Select Image

↓

Preview Image

↓

Upload

↓

Loading

↓

Diagnosis Result
```

Initially use mock data until backend is ready.

Mock response

```json
{
    "crop":"Tomato",
    "disease":"Early Blight",
    "confidence":94,
    "severity":"Moderate"
}
```

Later replace with backend API.

---

# 🗓️ Phase 6 - Diagnosis Result Page (Day 3)

Display

```
Crop

Disease

Confidence

Severity

Suggested Action
```

Also include

- Disease Image
- Confidence Bar
- Severity Badge

---

# 🗓️ Phase 7 - AI Chat Interface (Day 3)

Create

```
Chat.jsx
```

Features

- Farmer asks questions
- AI replies
- Chat history
- Typing animation
- Auto scroll

Example

```
Farmer

↓

"What should I do?"

↓

AI

↓

Suggested remedies
```

---

# 🗓️ Phase 8 - Weather Dashboard (Day 3)

Display

```
Temperature

Humidity

Rain Probability

Forecast
```

Design using weather cards.

---

# 🗓️ Phase 9 - Market Dashboard (Day 3)

Display

```
Current Price

Predicted Price

Price Trend

Historical Prices
```

Include

- Line chart
- Trend indicator
- Price comparison

---

# 🗓️ Phase 10 - Recommendation Page (Day 4)

Display

```
SELL

or

HOLD
```

Show

- Current Price
- Predicted Price
- Yield Loss
- Weather Risk
- AI Explanation

This page should clearly explain **WHY** the recommendation was made.

---

# 🗓️ Phase 11 - Community Q&A (Day 4)

Create

```
Community.jsx
```

Features

- View Questions
- Ask Question
- Reply
- AI Suggested Answer
- Search Questions

Layout

```
Question

↓

Replies

↓

AI Suggestion
```

---

# 🗓️ Phase 12 - Multilingual UI (Day 4)

Support

```
English

हिन्दी

ಕನ್ನಡ
```

Create a language selector.

The backend will return translated content.

Frontend simply changes displayed language.

---

# 🗓️ Phase 13 - API Integration (Day 5)

Create

```
services/

api.js
```

All backend communication happens here.

Functions

```
login()

register()

diagnoseCrop()

askAI()

getWeather()

getMarket()

getRecommendation()

getCommunityPosts()

postCommunityQuestion()

postAnswer()
```

Do **NOT** call APIs directly inside components.

Always use the service layer.

---

# 🗓️ Phase 14 - Connect Frontend to Backend (Day 5)

Replace mock data.

Flow

```
React

↓

Axios

↓

FastAPI

↓

JSON

↓

React
```

Every page should now receive real backend data.

---

# 🗓️ Phase 15 - Error Handling (Day 5)

Handle

- No Internet
- Server Down
- Invalid Image
- Loading States
- Empty Responses
- API Errors

Show friendly messages to users.

---

# 🗓️ Phase 16 - Responsive Design (Day 5)

Test

- Desktop
- Tablet
- Mobile

Ensure

- Buttons remain clickable
- Cards resize properly
- Navigation works
- Images scale correctly

---

# 🗓️ Phase 17 - Frontend Testing (Day 6)

Test

### Login

- Valid login
- Invalid login

---

### Crop Upload

- Valid image
- Wrong file type
- No image selected

---

### Chat

- Send message
- Receive response
- Empty message

---

### Community

- Add post
- Add answer
- Search

---

### Recommendation

Verify recommendation page updates correctly.

---

# 🗓️ Phase 18 - Final Integration (Day 6)

Test the complete application.

```
Dashboard

↓

Upload Crop

↓

Diagnosis

↓

Weather

↓

Market

↓

Recommendation

↓

Ask AI

↓

Community
```

Everything should work without refreshing the page.

---

# Git Workflow

Always work in your own branch.

Before starting

```bash
git checkout develop

git pull origin develop
```

Commit frequently

```bash
git add .

git commit -m "Implemented diagnosis page"
```

Push

```bash
git push origin feature/frontend
```

Create a Pull Request into `develop`.

---

# Deliverables

By the end of development, Person 1 should provide:

- ✅ Responsive React frontend
- ✅ Dashboard
- ✅ Crop Upload Page
- ✅ Diagnosis Result Page
- ✅ AI Chat Interface
- ✅ Weather Dashboard
- ✅ Market Dashboard
- ✅ Recommendation Page
- ✅ Community Q&A UI
- ✅ Multilingual UI
- ✅ API Integration
- ✅ Error Handling
- ✅ Responsive Design
- ✅ Frontend Testing
- ✅ Final Demo UI

---

# Final Frontend Architecture

```
                 Farmer
                    │
                    ▼
              React Frontend
                    │
       ┌────────────┼────────────┐
       │            │            │
       ▼            ▼            ▼
   Components     Pages      Services
       │            │            │
       └────────────┼────────────┘
                    ▼
                 Axios API
                    │
                    ▼
              FastAPI Backend
                    │
        ┌───────────┼───────────┐
        ▼           ▼           ▼
    PostgreSQL   AI Models   External APIs
                    │
                    ▼
               JSON Response
                    │
                    ▼
              React Components
                    │
                    ▼
                 Farmer UI
```

> **Success Criteria:** The frontend should be independent of backend implementation details. All communication must happen through the `services/api.js` layer, making it easy to switch APIs or add new clients (e.g., mobile app or future WhatsApp integration) without changing the UI components.