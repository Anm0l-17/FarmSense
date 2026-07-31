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

def clean_markdown_formatting(text: str) -> str:
    """Strip out markdown bold asterisks, headers, horizontal rules and extra symbols for pure plain text."""
    if not text:
        return ""
    cleaned = text.replace("**", "").replace("###", "").replace("##", "").replace("#", "").replace("---", "")
    return cleaned.strip()

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

    openai_key = getattr(settings, "OPENAI_API_KEY", os.getenv("OPENAI_API_KEY", ""))
    gemini_key = getattr(settings, "GEMINI_API_KEY", os.getenv("GEMINI_API_KEY", ""))

    system_instruction = (
        f"You are AgriSense, an empathetic, expert agricultural advisor helping smallholder farmers. "
        f"Explain crop health diagnosis, disease treatments, and market advice in clear, encouraging, practical terms. "
        f"STRICT RULE: Do NOT use markdown bold asterisks (**), headers (###), or divider lines (---). "
        f"Provide pure plain text without bold syntax. Always respond entirely in {lang_name}."
    )

    # 1. Primary: OpenAI API (GPT-4o-mini)
    if openai_key and "your_" not in openai_key:
        try:
            headers = {
                "Authorization": f"Bearer {openai_key}",
                "Content-Type": "application/json"
            }
            payload = {
                "model": "gpt-4o-mini",
                "messages": [
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": f"{context_str}\n\nFarmer Question: {message}"}
                ],
                "max_tokens": 500
            }
            res = requests.post("https://api.openai.com/v1/chat/completions", json=payload, headers=headers, timeout=10)
            if res.status_code == 200:
                data = res.json()
                raw_txt = data["choices"][0]["message"]["content"].strip()
                return clean_markdown_formatting(raw_txt)
            else:
                print(f"OpenAI API status {res.status_code}: {res.text}. Attempting failover to Gemini.")
        except Exception as e:
            print(f"OpenAI API error ({e}). Attempting failover to Gemini.")

    # 2. Secondary Failover: Google Gemini API
    if gemini_key and "your_" not in gemini_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_key)
            
            prompt = f"{system_instruction}\n{context_str}\n\nFarmer Question: {message}"

            # Try supported model names
            for model_name in GEMINI_MODEL_NAMES:
                try:
                    model = genai.GenerativeModel(model_name)
                    response = model.generate_content(prompt)
                    if response and response.text:
                        return clean_markdown_formatting(response.text)
                except Exception:
                    continue

        except Exception as e:
            print(f"Gemini API failover error ({e}). Using intelligent offline response engine.")

    # 3. Offline Intelligent Fallback Response
    if language == "hi":
        return clean_markdown_formatting(
            f"नमस्कार! आपकी फसल के लिए जरूरी कृषि सलाह:\n"
            f"1. बीमारी से प्रभावित पत्तियों को तुरंत काटकर खेत से दूर ले जाकर नष्ट करें।\n"
            f"2. सही फफूंदनाशक जैसे कॉपर ऑक्सीक्लोराइड या मैंकोज़ेब का छिड़काव करें।\n"
            f"3. मंडी के दाम और मौसम की चेतावनी देखकर सही समय पर बिक्री का निर्णय लें।"
        )
    elif language == "kn":
        return clean_markdown_formatting(
            f"ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಬೆಳೆಯ ಆರೈಕೆಗಾಗಿ ಕೃಷಿ ಸಲಹೆಗಳು:\n"
            f"1. ರೋಗಪೀಡಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ ಕಾಪಾಡಿ.\n"
            f"2. ಸೂಕ್ತವಾದ ಶಿಲೀಂಧ್ರನಾಶಕವನ್ನು ಸಿಂಪಡಿಸಿ.\n"
            f"3. ಮಾರುಕಟ್ಟೆ ದರವನ್ನು ಗಮನಿಸಿ ಮಾರಾಟ ಮಾಡಿ."
        )
    else:
        return clean_markdown_formatting(
            f"Hello! Here is practical advice for your crop:\n"
            f"1. Prune and safely discard heavily infected leaves to stop disease spread.\n"
            f"2. Ensure proper air ventilation between plants and avoid over-watering the foliage.\n"
            f"3. Track market trends carefully and consider holding or selling based on weather risks."
        )
