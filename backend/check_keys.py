import os
import requests
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(env_path)

openweather_key = os.getenv("OPENWEATHER_API_KEY", "")
gemini_key = os.getenv("GEMINI_API_KEY", "")
openai_key = os.getenv("OPENAI_API_KEY", "")

print("=== AgriSense API Key Connectivity Diagnostic ===")

# 1. Test OpenWeatherMap API
print("\n1. OpenWeatherMap API Check:")
if not openweather_key or "your_" in openweather_key:
    print("❌ OPENWEATHER_API_KEY is using placeholder value.")
else:
    try:
        url = f"https://api.openweathermap.org/data/2.5/weather?q=Bangalore&appid={openweather_key}"
        res = requests.get(url, timeout=5)
        if res.status_code == 200:
            data = res.json()
            print(f"✅ OpenWeatherMap API Connected Successfully!")
            print(f"   City: {data['name']}, Temp: {round(data['main']['temp']-273.15, 1)}°C, Weather: {data['weather'][0]['description']}")
        else:
            print(f"⚠️ OpenWeatherMap API status: {res.status_code}")
    except Exception as e:
        print(f"❌ OpenWeatherMap API error: {e}")

# 2. Test Gemini API
print("\n2. Google Gemini API Check:")
if not gemini_key or "your_" in gemini_key:
    print("ℹ️ GEMINI_API_KEY not provided.")
else:
    try:
        import google.generativeai as genai
        genai.configure(api_key=gemini_key)
        model = genai.GenerativeModel("gemini-2.0-flash")
        response = model.generate_content("Say hello in one short sentence for AgriSense testing.")
        if response and response.text:
            print(f"✅ Google Gemini API Connected Successfully! (Model: gemini-2.0-flash)")
            print(f"   Gemini Response: '{response.text.strip()}'")
        else:
            print("⚠️ Gemini API returned empty response.")
    except Exception as e:
        print(f"❌ Gemini API error: {e}")

# 3. Test OpenAI API
print("\n3. OpenAI API Check:")
if not openai_key or "your_" in openai_key:
    print("ℹ️ OPENAI_API_KEY not provided.")
else:
    try:
        headers = {"Authorization": f"Bearer {openai_key}", "Content-Type": "application/json"}
        payload = {
            "model": "gpt-4o-mini",
            "messages": [{"role": "user", "content": "Say hello in one short sentence for AgriSense testing."}],
            "max_tokens": 50
        }
        res = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=5)
        if res.status_code == 200:
            text = res.json()["choices"][0]["message"]["content"].strip()
            print(f"✅ OpenAI API Connected Successfully!")
            print(f"   OpenAI Response: '{text}'")
        else:
            err_detail = res.json().get("error", {}).get("code", res.status_code)
            print(f"⚠️ OpenAI API returned status code {res.status_code} ({err_detail}). Will be used as backup failover.")
    except Exception as e:
        print(f"❌ OpenAI API error: {e}")

print("\n=================================================")
