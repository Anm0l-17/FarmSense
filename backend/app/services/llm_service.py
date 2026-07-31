import os
import requests
from sqlalchemy.orm import Session
from app.config import settings
from app.database.models import CropDiagnosis, Recommendation

LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi",
    "kn": "Kannada"
}

GEMINI_MODEL_NAMES = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-flash-latest", "gemini-1.5-flash"]

def generate_ai_response(
    message: str,
    diagnosis_id: str = None,
    language: str = "en",
    db: Session = None
) -> str:
    lang_name = LANGUAGE_NAMES.get(language.lower(), "English")
    
    # Build context string
    context_str = ""
    if db and diagnosis_id:
        diag = db.query(CropDiagnosis).filter(CropDiagnosis.diagnosis_id == diagnosis_id).first()
        if diag:
            rec = db.query(Recommendation).filter(Recommendation.diagnosis_id == diagnosis_id).first()
            context_str = f"\n[Crop Context: {diag.crop}, Disease Identified: {diag.disease}, Severity: {diag.severity}, Confidence: {diag.confidence * 100:.1f}%]"
            if rec:
                context_str += f"\n[Advisor Decision: {rec.decision}, Reason: {rec.reason}, Current Price: ₹{rec.current_price}, Predicted 7D Price: ₹{rec.predicted_price}]"

    gemini_key = getattr(settings, "GEMINI_API_KEY", os.getenv("GEMINI_API_KEY", ""))
    openai_key = os.getenv("OPENAI_API_KEY", "")

    # 1. Primary: Google Gemini API
    if gemini_key and "your_" not in gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            
            system_prompt = (
                f"You are AgriSense, an empathetic, expert agricultural advisor helping smallholder farmers. "
                f"Explain crop health diagnosis, disease treatments, and market advice in clear, encouraging, practical terms. "
                f"Always respond entirely in {lang_name}.\n"
                f"{context_str}\n\n"
                f"Farmer Question: {message}"
            )

            # Try supported model names
            for model_name in GEMINI_MODEL_NAMES:
                try:
                    model = genai.GenerativeModel(model_name)
                    response = model.generate_content(system_prompt)
                    if response and response.text:
                        return response.text.strip()
                except Exception:
                    continue

        except Exception as e:
            print(f"Gemini API error ({e}). Attempting failover to OpenAI.")

    # 2. Secondary Failover: OpenAI API (GPT-4o-mini)
    if openai_key and "your_" not in openai_key:
        try:
            headers = {
                "Authorization": f"Bearer {openai_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {
                        "role": "system",
                        "content": f"You are AgriSense, an expert agricultural advisor helping smallholder farmers. Explain crop health, treatments, and market advice in simple terms. Respond entirely in {lang_name}."
                    },
                    {
                        "role": "user",
                        "content": f"{context_str}\n\nFarmer Question: {message}"
                    }
                ],
                "max_tokens": 500
            }
            res = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=10)
            if res.status_code == 200:
                data = res.json()
                return data["choices"][0]["message"]["content"].strip()
            else:
                print(f"OpenAI API status {res.status_code}: {res.text}")
        except Exception as e:
            print(f"OpenAI API failover error ({e}). Using intelligent offline response engine.")

    # 3. Offline Intelligent Fallback Response
    if language == "hi":
        return (
            f"नमस्कार! फसल ({context_str or 'फसल'}) के लिए कृषि सलाह:\n"
            f"1. प्रभावित पत्तियों को तुरंत बदलकर हटा दें।\n"
            f"2. कॉपर ऑक्सीक्लोराइड या मैंकोज़ेब (Mancozeb) फफूंदनाशक का छिड़काव करें।\n"
            f"3. बाज़ार भाव का अनुमान देखकर सही समय पर बिक्री करें।"
        )
    elif language == "kn":
        return (
            f"ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಬೆಳೆಯ ({context_str or 'ಬೆಳೆ'}) ಆರೈಕೆಗಾಗಿ ಸಲಹೆಗಳು:\n"
            f"1. ರೋಗಪೀಡಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ.\n"
            f"2. ಸೂಕ್ತವಾದ ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ಸಿಂಪಡಿಸಿ.\n"
            f"3. ಮಾರುಕಟ್ಟೆ ದರವನ್ನು ಗಮನಿಸಿ ಮಾರಾಟ ಮಾಡಿ."
        )
    else:
        return (
            f"Hello! Here is practical advice for your crop {context_str or ''}:\n"
            f"1. **Remedy**: Prune and safely discard heavily infected leaves to stop disease spread.\n"
            f"2. **Prevention**: Ensure proper air ventilation between plants and avoid over-watering the foliage.\n"
            f"3. **Market Strategy**: Track market trends carefully and consider holding or selling based on weather risks."
        )
