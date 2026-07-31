import os
import requests
from dotenv import load_dotenv

env_path = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(env_path)

gemini_key = os.getenv("GEMINI_API_KEY", "")

import google.generativeai as genai
genai.configure(api_key=gemini_key)

print("Listing available Gemini models for your API key...")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print("Found model:", m.name)
except Exception as e:
    print("Error listing models:", e)

# Test REST call directly
url = f"https://generativelanguage.googleapis.com/v1beta/models?key={gemini_key}"
res = requests.get(url)
print("REST API Status:", res.status_code)
if res.status_code == 200:
    models = [m["name"] for m in res.json().get("models", [])]
    print("REST Models available:", models[:5])
else:
    print("REST Error:", res.text[:200])
