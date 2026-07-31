import google.generativeai as genai
from sqlalchemy.orm import Session
from app.config import settings
from app.database.models import CropDiagnosis, Recommendation

LANGUAGE_NAMES = {
    "en": "English",
    "hi": "Hindi",
    "kn": "Kannada"
}

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

    api_key = settings.GEMINI_API_KEY
    if api_key and api_key != "your_gemini_api_key_here":
        try:
            genai.configure(api_key=api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            
            system_prompt = (
                f"You are AgriSense, an empathetic, expert agricultural advisor helping smallholder farmers. "
                f"Explain crop health diagnosis, disease treatments, and market advice in clear, encouraging, practical terms. "
                f"Always respond entirely in {lang_name}.\n"
                f"{context_str}\n\n"
                f"Farmer Question: {message}"
            )
            
            response = model.generate_content(system_prompt)
            if response and response.text:
                return response.text.strip()
        except Exception as e:
            print(f"Gemini API error ({e}). Using expert offline response engine.")

    # Intelligent fallback responses by language
    if language == "hi":
        return (
            f"नमस्कार! आपके फसल ({context_str or 'फसल'}) के लिए हमारी सलाह:\n"
            f"1. प्रभावित पत्तियों को तुरंत हटा दें।\n"
            f"2. सही फफूंदनाशक (Fungicide) का छिड़काव करें।\n"
            f"3. बाज़ार के रुझानों के अनुसार, सही समय पर उपज बेचें।"
        )
    elif language == "kn":
        return (
            f"ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಬೆಳೆಯ ಆರೈಕೆಗಾಗಿ ನಮ್ಮ ಸಲಹೆಗಳು:\n"
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
