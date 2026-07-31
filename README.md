# Farm Sense

Submission for the Synaptrix

## Problem Statement Chosen

**Domain:** AgriSense

**Problem Statement:** Farmers struggle to make timely decisions because crop health, weather, and market information is fragmented, making it difficult to know what action to take.

## Team

**Team Name:** Team Hoskote

## Our Solution

AI Farm Companion is an AI-powered decision-support platform that helps farmers make smarter, timely farming decisions. It analyzes crop images to detect diseases and assess severity, while combining weather conditions, market prices, price trends, and estimated yield impact. The system then provides actionable Sell, Hold, or Sell Partially recommendations with clear AI-generated explanations. It also offers a multilingual AI farm assistant and a Community Q&A platform for accessible, farmer-focused support.

## AI Component(Optional)

OpenAI API — GPT-4o-mini for AI-powered crop image analysis, farming recommendations, and the AI Farm Assistant.

* **What it does in our app:**
  The OpenAI model analyzes uploaded crop images to identify the crop and possible disease, assess severity, and provide relevant farming guidance. It also powers the AI Farm Assistant, which uses crop diagnosis, weather, and market information to provide contextual answers and explain recommendations such as Sell, Hold, or Sell Partially. The system is designed to provide farmer-friendly responses and multilingual support.

* **Why we chose this approach:**
  We chose OpenAI's multimodal model because it can process both images and natural language queries, allowing us to integrate crop analysis and conversational assistance without building and training a separate computer-vision model. This makes the solution faster to develop while still providing an interactive AI experience. It also allows the AI assistant to use the farmer's current crop and market context rather than providing only generic agricultural advice.

## Tech Stack

* **Frontend:**
  React, TypeScript, Tailwind CSS, Recharts

* **Backend:**
  Python, FastAPI, REST APIs

* **AI/ML:**
  OpenAI API — GPT-4o-mini for multimodal crop-image analysis, AI Farm Assistant, contextual recommendations, and multilingual responses.

* **Database/Storage:**
  PostgreSQL for user data, crop diagnoses, recommendations, market data, weather data, and Community Q&A. Object storage for uploaded crop images.

* **Other tools/APIs:**
  Lovable for AI-assisted frontend development, GitHub for version control, Weather API for weather information, market-price data/API for crop prices and trends.

## Features Implemented

### Core Requirements:
* AI-powered crop disease analysis using the OpenAI API.
* Crop image upload and diagnosis workflow.
* Disease identification with severity assessment and actionable guidance.
* Weather information and crop-related weather risk insights.
* Local crop market prices and price-trend visualization.
* AI-assisted Sell / Hold / Sell Partially decision support.
* AI Farm Assistant for farmer queries and contextual guidance.
* Farmer dashboard combining crop health, weather, and market insights.
* Community Q&A section for farmers to ask questions and share knowledge.
* Responsive, farmer-friendly green-themed interface.

### Bonus Features Attempted:
* **Multilingual AI support** — enabling farmers to interact with the AI assistant in regional languages such as Kannada and Hindi.
* **Community Q&A** — allowing farmers to post questions, view answers, and share practical knowledge.

## How to Run This Project

```bash
# Clone the repo
git clone [your-repo-link]

# Install dependencies
[e.g., npm install / pip install -r requirements.txt]

# Copy the example env file and fill in your own keys
cp .env.example .env

# Run the project
[e.g., npm start / python app.py]
```

If your project needs an API key to run, make sure `.env.example` is up to date so judges can test it easily (or provide a demo mode/mock key if the key is private).

## Screenshots (Optional)

## How to Run This Project

### API Keys / Environment Variables

Do **not** hardcode API keys or upload them directly to GitHub. Instead:

1. Create a `.env` file in your project root and put all your API keys/secrets there.
2. Add `.env` to your `.gitignore` file so it never gets pushed to your public repo.
3. Create a `.env.example` file (this one *should* be committed) listing the variable names your project needs, without real values so judges know exactly which keys to add on their end.
