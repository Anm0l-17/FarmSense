# Farm Companion AI

# AI FARM COMPANION

# MAXIMUM HACKATHON MVP — LOVABLE BUILD SPECIFICATION

============================================================

0. IMPORTANT BUILD INSTRUCTION

============================================================

You are building a hackathon-ready agricultural AI platform.

The development team has approximately 6 hours and 2 members,

but AI-assisted coding will be used heavily.

Therefore:

BUILD THE MAXIMUM PRACTICAL FUNCTIONAL PRODUCT.

Do NOT unnecessarily remove features simply because this is a

hackathon.

At the same time, do NOT create complicated engineering that

is unnecessary for the demo.

Use generated reusable components, mock data, local state and

service abstractions wherever appropriate.

The application must be:

- polished

- functional

- responsive

- visually impressive

- API-ready

- demo-safe

- easy to connect to a FastAPI backend later

IMPORTANT:

Every major feature must work in DEMO MODE even if the backend

is unavailable.

Create a clear mock/demo data layer so the entire application

can be demonstrated without a live backend.

The real backend can replace the mock service layer later.

============================================================

1. PRODUCT NAME

============================================================

AI Farm Companion

Tagline:

"Smarter insights. Better decisions. Healthier farms."

Alternative short tagline:

"Your AI-powered farming companion."

============================================================

2. PRODUCT VISION

============================================================

AI Farm Companion is an AI-powered decision-support platform

for farmers.

It combines:

- Crop disease detection

- Disease severity assessment

- Crop health analysis

- Weather intelligence

- Market price intelligence

- Price prediction

- Yield-loss estimation

- Sell / Hold / Partial Sell recommendations

- AI Farm Assistant

- Multilingual interaction

- Community Q&A

- Diagnosis history

- Alerts and notifications

The core product concept is:

A farmer uploads a crop image.

The system identifies a possible disease.

The system combines the diagnosis with:

- disease severity

- weather conditions

- weather risk

- current market price

- predicted market price

- estimated yield loss

Then the system produces an actionable recommendation:

SELL

HOLD

or

SELL PARTIALLY

The AI assistant then explains the recommendation in simple

farmer-friendly language.

The platform should feel like one intelligent system rather

than a collection of unrelated dashboards.

============================================================

3. CORE INTELLIGENCE FLOW

============================================================

The central architecture and UX should communicate:

                CROP IMAGE

                    |

                    v

             AI DIAGNOSIS

                    |

          +---------+---------+

          |         |         |

          v         v         v

       DISEASE   SEVERITY   CONFIDENCE

          |

          +------------------+

                             |

                  +----------+----------+

                  |                     |

                  v                     v

              WEATHER                MARKET

                  |                     |

                  v                     v

             WEATHER RISK        PRICE TREND

                  |                     |

                  +----------+----------+

                             |

                             v

                       YIELD IMPACT

                             |

                             v

                    DECISION ENGINE

                             |

                +------------+------------+

                |            |            |

                v            v            v

              SELL         HOLD      SELL PARTIALLY

                             |

                             v

                       AI EXPLANATION

                             |

                             v

                    AI FARM ASSISTANT

                             |

                             v

                    MULTILINGUAL SUPPORT

This relationship should be visible throughout the UI.

============================================================

4. PRIMARY USER

============================================================

Primary users:

- Small farmers

- Medium-scale farmers

- Farmers with limited technical knowledge

- Smartphone-first users

- Farmers who prefer regional languages

The application must not feel technical.

Avoid excessive terminology.

Instead of:

"Classification confidence"

Use:

"AI Confidence: 94%"

Instead of:

"Time-series forecasting"

Use:

"Expected price in 3 days"

Instead of:

"Risk probability"

Use:

"Weather Risk: Moderate"

============================================================

5. DESIGN LANGUAGE

============================================================

The entire application must have a premium agricultural

technology aesthetic.

Theme:

GREEN + AGRICULTURE + AI + TRUST + SIMPLICITY

Primary:

#166534

Secondary:

#22C55E

Light green:

#DCFCE7

Very light green:

#F0FDF4

Background:

#F7FAF7

White:

#FFFFFF

Text:

#17201A

Muted:

#647067

Warning:

#F59E0B

Danger:

#DC2626

Success:

#16A34A

Use green as the primary brand color.

Do NOT make every component green.

Use:

- white cards

- subtle borders

- soft shadows

- rounded corners

- clean spacing

- readable typography

- modern icons

The application should look like a real agricultural startup

product rather than a generic admin dashboard.

============================================================

6. RESPONSIVE APPLICATION STRUCTURE

============================================================

DESKTOP:

Use a left sidebar.

Sidebar:

🌱 AI Farm Companion

Navigation:

🏠 Dashboard

📸 Crop Diagnosis

📊 Market & Weather

🤖 AI Farm Assistant

👨‍🌾 Community

📋 My History

Bottom:

⚙ Settings

User section at bottom.

MOBILE:

Use:

Top header

Main content

Bottom navigation

Bottom navigation:

Home

Diagnose

Assistant

Community

More

Tablet:

Collapsible sidebar.

============================================================

7. GLOBAL HEADER

============================================================

Header should contain:

Page title

Contextual subtitle

Right side:

Language selector

Notification icon

User avatar

Language selector:

English

ಕನ್ನಡ

हिन्दी

The selected language should persist during the session.

============================================================

8. DEMO MODE

============================================================

Create a DEMO MODE.

The application should work completely without the backend.

Add a small development/demo indicator:

"Demo Mode"

Do not make it visually distracting.

The following should work in demo mode:

- Dashboard

- Crop upload

- Diagnosis

- Diagnosis result

- Severity

- Yield impact

- Weather

- Market

- Price prediction

- Recommendation

- AI chat

- Multilingual response simulation

- Community

- History

- Notifications

The mock service layer must imitate realistic API responses.

IMPORTANT:

Do NOT make the interface feel fake.

Use realistic delays for:

- diagnosis

- AI response

- market loading

- weather loading

Example:

Diagnosis:

2–3 second simulated processing

AI:

1–2 second simulated response

============================================================

9. DASHBOARD

============================================================

The dashboard should immediately answer:

"How is my farm doing today?"

HEADER:

Good morning, Farmer 👋

Here's what's happening with your farm today.

Primary CTA:

+ Diagnose a Crop

------------------------------------------------------------

9.1 SUMMARY METRICS

------------------------------------------------------------

Create four summary cards:

1. Latest Diagnosis

2. Weather Risk

3. Market Price

4. Crop Health

LATEST DIAGNOSIS:

Tomato

Early Blight

94% confidence

Moderate

View Diagnosis

WEATHER:

28°C

82% humidity

70% rain probability

Moderate Risk

MARKET:

Tomato

₹24/kg

Predicted:

₹28/kg

+16.7%

CROP HEALTH:

Overall:

Good

1 active issue

Monitor closely

------------------------------------------------------------

9.2 MAIN AI RECOMMENDATION

------------------------------------------------------------

Create a large visually prominent card.

Header:

🤖 AI Farm Recommendation

Decision:

🟢 HOLD

Display:

Current Price:

₹24/kg

Expected Price:

₹28/kg

Disease Severity:

Moderate

Weather Risk:

Moderate

Estimated Yield Loss:

15%

WHY?

"Market prices are expected to increase over the next few days

while the current crop risk remains manageable."

Button:

View Detailed Recommendation

------------------------------------------------------------

9.3 CROP HEALTH

------------------------------------------------------------

Show crop image.

Tomato

Early Blight

Moderate Severity

94% AI Confidence

Display a mini severity indicator.

Button:

View Diagnosis

------------------------------------------------------------

9.4 WEATHER SNAPSHOT

------------------------------------------------------------

Display:

Temperature

Humidity

Rain probability

Wind

Example:

28°C

82%

70%

12 km/h

Weather Risk:

MODERATE

Button:

View Weather

------------------------------------------------------------

9.5 MARKET SNAPSHOT

------------------------------------------------------------

Display mini chart.

Current:

₹24/kg

Expected:

₹28/kg

Trend:

↑

Button:

View Market

------------------------------------------------------------

9.6 QUICK ACTIONS

------------------------------------------------------------

Large action buttons:

📸 Diagnose Crop

💰 Check Market

🌦️ Check Weather

🤖 Ask AI

============================================================

10. CROP DIAGNOSIS

============================================================

This is the HERO FEATURE.

The experience should feel like an AI-powered analysis tool.

PAGE:

Crop Diagnosis

"Upload a clear photo of your crop to identify possible diseases

and understand their severity."

------------------------------------------------------------

10.1 UPLOAD AREA

------------------------------------------------------------

Large drag-and-drop zone.

Display:

📸

"Upload your crop image"

"Drag & drop or browse from your device"

Button:

Browse Image

Supported:

JPG

JPEG

PNG

Maximum:

10 MB

------------------------------------------------------------

10.2 IMAGE QUALITY TIPS

------------------------------------------------------------

Display:

For better results:

✓ Good lighting

✓ Focus on affected leaves

✓ Avoid blurry images

✓ Keep the affected area visible

✓ Avoid excessive shadows

------------------------------------------------------------

10.3 IMAGE PREVIEW

------------------------------------------------------------

After upload:

Show image.

Buttons:

Remove

Analyze Crop

------------------------------------------------------------

10.4 ANALYSIS PROGRESS

------------------------------------------------------------

When analysis starts:

"Analyzing your crop..."

Progress bar.

Show stages:

✓ Image uploaded

✓ Identifying crop

● Detecting possible disease

○ Estimating severity

○ Preparing recommendations

Use animated progress.

Do not use only a generic spinner.

============================================================

11. DIAGNOSIS RESULT

============================================================

Show a polished results page.

------------------------------------------------------------

11.1 MAIN RESULT

------------------------------------------------------------

Crop:

Tomato

Possible Disease:

Early Blight

AI Confidence:

94%

Severity:

MODERATE

Display a clear visual severity scale:

LOW ---- MODERATE ---- HIGH

Highlight MODERATE.

Description:

"Moderate severity detected. Action and regular monitoring

are recommended."

------------------------------------------------------------

11.2 DISEASE EXPLANATION

------------------------------------------------------------

Title:

What does this mean?

Example:

"Early Blight is a fungal disease that commonly affects tomato

leaves. If it spreads, it can reduce plant health and yield."

------------------------------------------------------------

11.3 SYMPTOMS

------------------------------------------------------------

Display:

- Brown spots on leaves

- Circular lesions

- Yellowing around affected areas

------------------------------------------------------------

11.4 WHAT SHOULD I DO?

------------------------------------------------------------

Display practical actions:

1. Remove heavily infected leaves.

2. Avoid overhead watering.

3. Improve airflow around plants.

4. Monitor nearby plants.

5. Follow locally recommended treatment guidance.

Button:

Ask AI About This Diagnosis

------------------------------------------------------------

11.5 YIELD IMPACT

------------------------------------------------------------

Large card:

Estimated Potential Yield Loss

15%

Potential Revenue Impact:

₹6,000 – ₹9,000

Include:

"Estimate based on available crop and disease information."

------------------------------------------------------------

11.6 DIAGNOSIS METADATA

------------------------------------------------------------

Show:

Analyzed:

Today, 10:42 AM

Crop:

Tomato

Confidence:

94%

Severity:

Moderate

------------------------------------------------------------

11.7 SAVE DIAGNOSIS

------------------------------------------------------------

Button:

Save to History

============================================================

12. MARKET & WEATHER

============================================================

This page combines two important decision factors.

PAGE TITLE:

Market & Weather

"Understand the conditions affecting your crop."

------------------------------------------------------------

12.1 CROP SELECTOR

------------------------------------------------------------

Dropdown:

Tomato

Potato

Onion

Paddy

Maize

Cotton

Location selector:

My Location

Bangalore

Other locations

------------------------------------------------------------

12.2 MARKET OVERVIEW

------------------------------------------------------------

Large card:

Tomato

Current Market Price:

₹24/kg

Change:

↑ 8.2%

Market:

Local Market

Last Updated:

Today

------------------------------------------------------------

12.3 PRICE CHART

------------------------------------------------------------

Use Recharts.

Controls:

7 Days

30 Days

3 Months

Chart:

Historical price = solid line

Predicted price = dashed line

Include tooltip.

Make chart responsive.

------------------------------------------------------------

12.4 PRICE OUTLOOK

------------------------------------------------------------

Card:

Price Outlook

Current:

₹24/kg

Expected in 3 days:

₹28/kg

Expected Change:

+16.7%

Trend:

Bullish

Explanation:

"Recent market trends indicate a possible short-term increase."

Add:

"Prediction is an estimate and may change."

------------------------------------------------------------

12.5 WEATHER

------------------------------------------------------------

Display:

Temperature:

28°C

Humidity:

82%

Rain Probability:

70%

Rainfall:

6 mm

Wind:

12 km/h

------------------------------------------------------------

12.6 WEATHER RISK

------------------------------------------------------------

Large card:

Weather Risk

🟠 MODERATE

Explanation:

"High humidity and expected rainfall may increase the risk

of fungal disease spread."

Risk factors:

High humidity

Rainfall

Leaf wetness

============================================================

13. DECISION RECOMMENDATION

============================================================

This is a major differentiating feature.

Create a dedicated recommendation component that can be shown

on the Dashboard, Diagnosis Result and Market pages.

Possible decisions:

🟢 HOLD

🟠 SELL PARTIALLY

🔴 SELL

The recommendation should be generated from:

Disease severity

Weather risk

Current market price

Predicted market price

Estimated yield loss

------------------------------------------------------------

13.1 HOLD

------------------------------------------------------------

Example:

🟢 HOLD

Current:

₹24/kg

Expected:

₹28/kg

Disease:

Moderate

Weather:

Moderate Risk

Yield Loss:

15%

WHY?

"Prices are expected to increase while current crop risk

remains manageable."

------------------------------------------------------------

13.2 SELL

------------------------------------------------------------

Example:

🔴 SELL

Reason:

"High crop risk and potential yield loss may outweigh the

expected market increase."

------------------------------------------------------------

13.3 PARTIAL SELL

------------------------------------------------------------

Example:

🟠 SELL PARTIALLY

Recommendation:

Sell 40%

Hold 60%

Reason:

"Lock in part of the current value while keeping some crop

available for a possible price increase."

IMPORTANT:

Always explain the recommendation.

Never show only:

"HOLD"

============================================================

14. AI FARM ASSISTANT

============================================================

Create a premium chat experience.

PAGE TITLE:

AI Farm Assistant

Subtitle:

"Ask questions about your crop, disease, weather and market."

------------------------------------------------------------

14.1 CONTEXT HEADER

------------------------------------------------------------

Show current farm context:

🍅 Tomato

Early Blight

Moderate

94% confidence

Optional:

"Using your latest diagnosis"

------------------------------------------------------------

14.2 WELCOME MESSAGE

------------------------------------------------------------

AI:

"Hello! I'm your AI Farm Assistant.

I can help you understand your crop diagnosis, weather,

market prices and farming decisions."

------------------------------------------------------------

14.3 QUICK PROMPTS

------------------------------------------------------------

Create buttons:

Why should I hold?

How do I treat this disease?

Will rain affect my crop?

What is the expected price?

How much yield could I lose?

What should I do today?

------------------------------------------------------------

14.4 CHAT

------------------------------------------------------------

Farmer:

"Why should I hold?"

AI:

"Your current tomato price is ₹24/kg and the expected short-term

price is around ₹28/kg. Your crop currently has moderate disease

severity and moderate weather risk, so holding may provide a

better selling opportunity."

AI response must use available context.

------------------------------------------------------------

14.5 CHAT INPUT

------------------------------------------------------------

Input:

"Ask about your farm..."

Button:

Send

Optional attachment icon can be displayed but does not need

complex implementation.

------------------------------------------------------------

14.6 AI CONTEXT

------------------------------------------------------------

Whenever possible pass:

crop

disease

severity

confidence

yield_loss

weather

weather_risk

current_price

predicted_price

recommendation

to the AI service.

============================================================

15. MULTILINGUAL SUPPORT

============================================================

BONUS FEATURE.

Support:

English

Kannada

Hindi

The language selector should be available globally.

Priority:

AI Assistant.

Example:

English:

"Why should I hold?"

Kannada:

"ನಾನು ಬೆಳೆ ಕಾಯ್ದಿರಿಸಬೇಕೆ?"

AI should respond in Kannada.

Hindi:

"मुझे फसल अभी क्यों नहीं बेचनी चाहिए?"

AI should respond in Hindi.

Create translation architecture:

translations/

  en

  kn

  hi

Use reusable translation keys.

Do not hardcode translated strings throughout components.

============================================================

16. COMMUNITY Q&A

============================================================

Create a clean farmer community.

PAGE:

Community Q&A

"Ask questions, share experiences and learn from other farmers."

------------------------------------------------------------

16.1 SEARCH

------------------------------------------------------------

Search bar:

"Search questions..."

------------------------------------------------------------

16.2 FILTERS

------------------------------------------------------------

All

Disease

Weather

Market

Crops

------------------------------------------------------------

16.3 ASK QUESTION

------------------------------------------------------------

Button:

+ Ask Question

Modal:

Crop

Category

Question

Optional image

Button:

Post Question

------------------------------------------------------------

16.4 POST FEED

------------------------------------------------------------

Each post:

Avatar

Farmer name

Question

Crop

Category

Time

Answer count

Like count

Example:

Ramesh

"Why are my tomato leaves developing black spots?"

Tomato

Disease

6 answers

14 likes

2 hours ago

------------------------------------------------------------

16.5 QUESTION DETAIL

------------------------------------------------------------

Show:

Question

Farmer

Crop

Category

Timestamp

Image if available

Then:

🤖 AI Suggested Answer

Clearly label:

"AI-generated"

Then:

Community Answers

Display farmer answers.

Bottom:

"Write an answer..."

Post Answer

============================================================

17. MY HISTORY

============================================================

Create a simple diagnosis history.

PAGE:

My History

Display cards/table:

Date

Crop

Disease

Severity

Confidence

Example:

Today

Tomato

Early Blight

Moderate

94%

5 days ago

Potato

Late Blight

High

91%

Clicking an item opens its diagnosis.

============================================================

18. NOTIFICATIONS

============================================================

Create a notification dropdown.

Examples:

🦠 Disease Alert

"Your latest tomato diagnosis shows moderate disease severity."

💰 Market Alert

"Tomato prices increased by 8%."

🌧️ Weather Alert

"Rainfall is expected tomorrow."

🤖 Recommendation

"Your latest AI recommendation is ready."

Notifications can use mock data.

============================================================

19. USER PROFILE

============================================================

Keep profile simple.

Display:

Farmer Name

Preferred Language

Location

Recent Activity

Do NOT build complicated authentication.

For hackathon demo:

Use a mock user.

Example:

Name:

Ramesh Kumar

Location:

Bangalore

Preferred Language:

English

============================================================

20. SETTINGS

============================================================

Simple settings page.

Language

Notifications

Location

Units

No complex account management.

============================================================

21. API ARCHITECTURE

============================================================

The frontend must use a service abstraction.

Suggested structure:

src/

components/

  layout/

  dashboard/

  diagnosis/

  market/

  weather/

  assistant/

  community/

  common/

pages/

  Dashboard

  CropDiagnosis

  DiagnosisResult

  MarketWeather

  AIAssistant

  Community

  CommunityDetail

  History

  Settings

services/

  api.ts

  diagnosisService.ts

  marketService.ts

  weatherService.ts

  recommendationService.ts

  chatService.ts

  communityService.ts

data/

  mockDiagnosis.ts

  mockMarket.ts

  mockWeather.ts

  mockRecommendations.ts

  mockChat.ts

  mockCommunity.ts

hooks/

  useDiagnosis

  useMarket

  useWeather

  useChat

  useCommunity

types/

  diagnosis.ts

  market.ts

  weather.ts

  recommendation.ts

  community.ts

  user.ts

utils/

  formatCurrency

  formatDate

  translations

============================================================

22. BACKEND API CONTRACT

============================================================

Prepare the frontend for:

GET /health

POST /api/crop/diagnose

GET /api/crop/history

GET /api/crop/{diagnosis_id}

GET /api/weather

GET /api/market

GET /api/market/{crop}

GET /api/market/{crop}/prediction

POST /api/recommendation

POST /api/chat

GET /api/community/posts

POST /api/community/posts

GET /api/community/posts/{id}

POST /api/community/posts/{id}/answers

Use:

VITE_API_BASE_URL

Do not expose secrets in frontend.

============================================================

23. DATA STRUCTURES

============================================================

USER:

user_id

name

location

preferred_language

DIAGNOSIS:

diagnosis_id

user_id

crop

disease

confidence

severity

image_url

yield_loss

created_at

WEATHER:

location

temperature

humidity

rain_probability

rainfall

wind_speed

risk

timestamp

MARKET:

crop

market

location

current_price

historical_prices

predicted_prices

change_percentage

timestamp

RECOMMENDATION:

recommendation_id

diagnosis_id

decision

current_price

predicted_price

disease_severity

weather_risk

yield_loss

reason

created_at

COMMUNITY POST:

post_id

user_id

crop

category

question

image_url

created_at

answer_count

like_count

COMMUNITY ANSWER:

answer_id

post_id

user_id

answer

is_ai_generated

created_at

like_count

============================================================

24. MOCK DATA

============================================================

Use realistic mock data.

------------------------------------------------------------

DIAGNOSIS

------------------------------------------------------------

crop:

Tomato

disease:

Early Blight

confidence:

94%

severity:

Moderate

yield_loss:

15%

------------------------------------------------------------

WEATHER

------------------------------------------------------------

temperature:

28

humidity:

82

rain_probability:

70

rainfall:

6

wind_speed:

12

risk:

Moderate

------------------------------------------------------------

MARKET

------------------------------------------------------------

current_price:

24

predicted_price:

28

change_percentage:

8.2

Historical data:

Day 1: ₹20

Day 2: ₹21

Day 3: ₹22

Day 4: ₹21

Day 5: ₹23

Day 6: ₹24

Day 7: ₹24

Predicted:

Day 8: ₹25

Day 9: ₹27

Day 10: ₹28

------------------------------------------------------------

RECOMMENDATION

------------------------------------------------------------

decision:

HOLD

reason:

"Market prices are expected to increase over the next few

days while current crop risk remains manageable."

============================================================

25. DATABASE-FRIENDLY DESIGN

============================================================

The backend will eventually use PostgreSQL.

Keep entities simple:

users

diagnoses

recommendations

market_prices

weather_data

community_posts

community_answers

Relationships:

users

  |

  +---- diagnoses

  |

  +---- community_posts

             |

             +---- community_answers

diagnoses

  |

  +---- recommendations

Do not build complicated database relationships for the frontend.

============================================================

26. AI ARCHITECTURE

============================================================

IMPORTANT:

Do not make the LLM responsible for everything.

Use a layered architecture.

Layer 1:

Disease detection model/API

Output:

crop

disease

confidence

severity

Layer 2:

Data intelligence

Weather

Market

Price prediction

Yield estimate

Layer 3:

Decision engine

Combines structured inputs:

disease severity

weather risk

current price

predicted price

yield loss

Output:

SELL

HOLD

SELL PARTIALLY

Layer 4:

LLM

Explains the decision in natural language.

This makes the system more reliable and easier to explain

during the hackathon presentation.

============================================================

27. AI RESPONSE SAFETY

============================================================

AI responses must be advisory.

Use wording:

"may indicate"

"based on available information"

"estimated"

"consider"

Do not make guaranteed claims.

Example:

Correct:

"These symptoms may indicate Early Blight."

Incorrect:

"Your crop definitely has Early Blight."

For serious disease cases:

"Consider consulting a local agricultural expert."

============================================================

28. LOADING STATES

============================================================

Every asynchronous feature needs a meaningful loading state.

Diagnosis:

"Analyzing your crop..."

Market:

"Fetching market prices..."

Weather:

"Checking weather conditions..."

Recommendation:

"Preparing your recommendation..."

AI:

"AI is thinking..."

Community:

"Loading community questions..."

Use skeleton loaders where appropriate.

============================================================

29. ERROR STATES

============================================================

Use friendly error states.

Example:

"Something went wrong."

"We couldn't analyze this image. Please try uploading a clearer

photo."

Button:

Try Again

Network:

"We couldn't connect to the server."

Market:

"Market data is temporarily unavailable."

Do not display raw backend exceptions.

============================================================

30. EMPTY STATES

============================================================

History:

"No diagnoses yet."

"Upload your first crop image to get started."

Community:

"No questions found."

"Be the first farmer to ask a question."

Market:

"No market data available for this crop."

============================================================

31. RESPONSIVE DESIGN

============================================================

Desktop:

Sidebar + content

Tablet:

Collapsible sidebar

Mobile:

Top header

Content

Bottom navigation

All cards must stack correctly.

Charts must resize.

Upload must work on mobile.

Chat must be mobile-friendly.

Community feed must work smoothly on mobile.

============================================================

32. ACCESSIBILITY

============================================================

Use:

- readable typography

- strong contrast

- semantic HTML

- accessible buttons

- labels

- alt text

- keyboard-friendly controls

Never rely on color alone.

Example:

Do not display only:

🟠

Display:

🟠 MODERATE WEATHER RISK

============================================================

33. PERFORMANCE

============================================================

Optimize for a hackathon demo.

Use:

- lazy loading where appropriate

- optimized images

- reusable components

- minimal unnecessary re-renders

- responsive charts

- lightweight animations

Do not over-optimize prematurely.

============================================================

34. DEMO SAFETY

============================================================

This is extremely important.

If the backend is unavailable:

The application MUST still work.

Use:

Mock services

and a fallback strategy.

Example:

API request fails

↓

Fallback to mock data

↓

UI continues working

Display a small non-intrusive:

"Demo Data"

indicator where appropriate.

This ensures the live hackathon demonstration does not fail

because of an API issue.

============================================================

35. NO WHATSAPP

============================================================

Do NOT implement WhatsApp.

Do NOT create:

WhatsApp buttons

WhatsApp chatbot

WhatsApp API integration

WhatsApp notifications

WhatsApp is future scope.

Future architecture:

Farmer

↓

WhatsApp

↓

Backend

↓

Same diagnosis/recommendation/AI services

============================================================

36. FEATURES TO AVOID

============================================================

Do not build:

- Payment system

- E-commerce

- Complex admin panel

- Voice assistant

- IoT dashboard

- Satellite analytics

- Advanced farm management ERP

- Complex authentication

- Real-time messaging

- Expert booking

- Subscription system

These are outside the hackathon scope.

============================================================

37. QUICK ACTIONS THROUGHOUT THE APP

============================================================

Make important actions easy to access.

Dashboard:

Diagnose Crop

Check Market

Check Weather

Ask AI

Diagnosis:

Ask AI

View Market

View Weather

Market:

Ask AI

View Recommendation

AI:

Use Latest Diagnosis

Community:

Ask Question

This creates a connected experience.

============================================================

38. CROSS-PAGE CONTEXT

============================================================

IMPORTANT:

Data should flow between pages.

Example:

User diagnoses Tomato.

The selected diagnosis should become available to:

Dashboard

Market

Recommendation

AI Assistant

History

If the user opens:

"Ask AI About This Diagnosis"

the AI should automatically know:

Tomato

Early Blight

94%

Moderate

15% yield loss

Similarly, the recommendation should use:

Disease

Weather

Market

Do not make each page behave independently.

============================================================

39. DEMO USER JOURNEY

============================================================

The application must support the following live demo:

STEP 1:

Open Dashboard.

STEP 2:

Show:

Tomato

Early Blight

Moderate

₹24/kg

₹28/kg expected

28°C

Moderate weather risk

STEP 3:

Click:

Diagnose a Crop

STEP 4:

Upload a tomato leaf.

STEP 5:

Show AI analysis.

STEP 6:

Display:

Early Blight

94%

Moderate

STEP 7:

Show:

Estimated Yield Loss:

15%

STEP 8:

Open Market & Weather.

STEP 9:

Show:

Current:

₹24/kg

Expected:

₹28/kg

STEP 10:

Show weather:

28°C

82% humidity

70% rain probability

STEP 11:

Open recommendation.

Display:

🟢 HOLD

Explain why.

STEP 12:

Open AI Assistant.

Ask:

"Why should I hold?"

AI explains using the diagnosis + market + weather context.

STEP 13:

Change:

English → Kannada

Ask another question.

AI responds in Kannada.

STEP 14:

Open Community Q&A.

Show farmer questions and answers.

STEP 15:

Ask a new community question.

Post it.

============================================================

40. PRESENTATION-FIRST DESIGN

============================================================

The following elements should receive the most visual attention:

1. Crop diagnosis

2. Recommendation

3. AI Assistant

4. Market prediction

5. Weather risk

6. Multilingual interaction

The judges should understand the product within 30 seconds.

============================================================

41. HERO DASHBOARD VISUAL

============================================================

Create a visually strong dashboard section:

------------------------------------------------------------

        YOUR FARM AT A GLANCE

  🍅 Tomato

  Early Blight

  Moderate Severity

  Current Price       Expected Price

  ₹24/kg              ₹28/kg

  Weather Risk        Yield Impact

  Moderate            15%

        ┌─────────────────────┐

        │    🟢 HOLD          │

        │                     │

        │  AI Recommendation  │

        └─────────────────────┘

        Why?

  Prices may increase while current

  crop risk remains manageable.

------------------------------------------------------------

============================================================

42. COMPONENT REUSABILITY

============================================================

Create reusable components.

Examples:

AppLayout

Sidebar

Header

MobileNavigation

MetricCard

CropCard

DiagnosisCard

CropUploader

AnalysisProgress

SeverityIndicator

DiseaseInfo

YieldImpact

RecommendationCard

WeatherCard

MarketCard

PriceChart

RiskIndicator

ChatWindow

ChatMessage

QuickPrompt

ChatInput

CommunityPost

CommunityAnswer

AskQuestionModal

NotificationDropdown

LoadingState

ErrorState

EmptyState

============================================================

43. ROUTING

============================================================

Routes:

/dashboard

/crop-diagnosis

/crop-diagnosis/result

/market-weather

/ai-assistant

/community

/community/:id

/history

/settings

Do not require authentication for the hackathon demo.

============================================================

44. CODE QUALITY

============================================================

Use:

TypeScript

Strong typing

Reusable components

Clean naming

Separation of concerns

Avoid huge components.

Avoid duplicating code.

Keep API logic separate from UI.

============================================================

45. ENVIRONMENT VARIABLES

============================================================

Use:

VITE_API_BASE_URL

Create:

.env.example

Never expose:

LLM API keys

Database passwords

Secret API keys

Backend credentials

============================================================

46. GITHUB-FRIENDLY STRUCTURE

============================================================

The generated frontend should be easy to commit into:

ai-farm-companion/

frontend/

backend/

ml/

database/

README.md

.env.example

.gitignore

Lovable is responsible primarily for:

frontend/

Keep the architecture compatible with the above repository

structure.

============================================================

47. HACKATHON ACCEPTANCE CRITERIA

============================================================

The application is successful if:

✓ Dashboard is polished

✓ Crop image can be uploaded

✓ Image preview works

✓ Analysis progress works

✓ Disease result works

✓ Confidence works

✓ Severity works

✓ Disease explanation works

✓ Treatment recommendations work

✓ Yield loss works

✓ Weather works

✓ Weather risk works

✓ Market price works

✓ Historical chart works

✓ Price prediction works

✓ Sell recommendation works

✓ Hold recommendation works

✓ Partial sell recommendation works

✓ Recommendation explanation works

✓ AI assistant works

✓ AI receives farm context

✓ Multilingual support works

✓ Community Q&A works

✓ User can create a question

✓ User can view answers

✓ Diagnosis history works

✓ Notifications work in demo mode

✓ Mobile layout works

✓ Desktop layout works

✓ Loading states work

✓ Error states work

✓ Demo mode works without backend

✓ API service layer exists

✓ No WhatsApp implementation

✓ No unfinished placeholder screens

============================================================

48. DEVELOPMENT PRIORITY

============================================================

If implementation time becomes limited, prioritize in this order:

P0 — CRITICAL

1. Dashboard

2. Crop Diagnosis

3. Diagnosis Result

4. Market

5. Weather

6. Recommendation

7. AI Assistant

P1 — HIGH

8. Multilingual AI

9. Community Q&A

P2 — POLISH

10. History

11. Notifications

12. Profile

13. Settings

14. Animations

15. Advanced visual polish

If time is running out:

Do NOT sacrifice the core diagnosis → recommendation flow

for secondary features.

============================================================

49. IMPORTANT LOVABLE BUILD STRATEGY

============================================================

Build the application in this order:

PHASE 1:

Create global layout, navigation and design system.

PHASE 2:

Create Dashboard.

PHASE 3:

Create Crop Diagnosis + upload + analysis + results.

PHASE 4:

Create Market + Weather.

PHASE 5:

Create Recommendation Engine UI.

PHASE 6:

Create AI Farm Assistant.

PHASE 7:

Create Multilingual support.

PHASE 8:

Create Community Q&A.

PHASE 9:

Create History + Notifications.

PHASE 10:

Add responsive polish, loading states and error states.

============================================================

50. FINAL INSTRUCTION TO LOVABLE

============================================================

Build the maximum practical hackathon-ready version of

AI Farm Companion described above.

Do not create a basic template.

Do not create a generic dashboard.

Make the product visually polished and cohesive.

The core experience must feel like:

"AI understands my crop, understands the market and weather,

and helps me decide what to do."

Use realistic mock data and simulated API responses so that

the entire product is immediately demonstrable.

Keep the architecture API-ready for:

React frontend

+

FastAPI backend

+

PostgreSQL database

+

AI/ML services

The UI must be completely functional in Demo Mode.

If an API is unavailable, gracefully fall back to mock data.

Prioritize the core intelligence flow:

IMAGE

→ DIAGNOSIS

→ SEVERITY

→ YIELD IMPACT

→ WEATHER

→ MARKET

→ PRICE PREDICTION

→ DECISION

→ AI EXPLANATION

Make the recommendation the central "wow" feature.

The farmer should be able to understand the recommendation

without understanding AI.

The AI assistant should explain the decision using actual

diagnosis, weather, market and yield context.

Multilingual interaction should demonstrate accessibility

for regional-language farmers.

Community Q&A should demonstrate farmer-to-farmer knowledge

sharing.

Do NOT implement WhatsApp.

Do NOT spend time on unnecessary enterprise features.

Build maximum functionality with minimum custom engineering.

The final product should look and feel like a real startup

prototype that could be presented to judges immediately.

============================================================

END OF PRD

============================================================

Please isolate all external data calls inside a dedicated service file located at src/services/api.js (or .ts).

Provide clean, mock async functions for diagnoseCrop(), getWeather(), getMarketPrices(), and askChatbot().

Return realistic mock JSON data with simulated network delays (setTimeout) so the frontend loading spinners and UI states can be tested seamlessly.

Ensure these mock functions are exported clearly so we can swap them with real fetch() calls to a live FastAPI backend later.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://agro-sense-ai-17.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/c7ece614-3850-4b06-b61b-bdc4b905cf87).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
