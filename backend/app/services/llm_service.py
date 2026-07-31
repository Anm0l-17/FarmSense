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
        f"STRICT FORMAT RULE: Do NOT use markdown bold asterisks (**), headers (###), or divider lines (---). "
        f"Provide pure plain text without bold syntax. "
        f"CRITICAL LANGUAGE RULE: You MUST reply in the EXACT SAME LANGUAGE as the farmer's question. "
        f"(For example, if the question is asked in Hindi, answer entirely in Hindi; if asked in Kannada, answer entirely in Kannada; "
        f"if asked in English, answer in English). "
        f"If the language of the question cannot be clearly determined, default to replying in {lang_name}."
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

    # 3. Offline Intelligent Fallback Response Engine
    crop_name = "crop"
    disease_name = "leaf spot"
    severity_level = "MODERATE"
    curr_price = 2400
    pred_price = 2750
    decision_val = "HOLD"

    if db and diagnosis_id:
        diag = db.query(CropDiagnosis).filter(CropDiagnosis.diagnosis_id == diagnosis_id).first()
        if diag:
            crop_name = diag.crop
            disease_name = diag.disease
            severity_level = diag.severity
            rec = db.query(Recommendation).filter(Recommendation.diagnosis_id == diagnosis_id).first()
            if rec:
                curr_price = rec.current_price
                pred_price = rec.predicted_price
                decision_val = rec.decision

    q = message.lower()

    if any(k in q for k in ["price", "market", "cost", "sell", "rate", "mandi", "दाम", "कीमत", "बेशी", "ಬೆಲೆ", "ಮಾರಾಟ"]):
        if language == "hi":
            return clean_markdown_formatting(f"वर्तमान में {crop_name} का मंडी भाव ₹{curr_price}/क्विंटल है। 7 दिनों में भाव ₹{pred_price}/क्विंटल होने का अनुमान है। सलाह: {decision_val}।")
        elif language == "kn":
            return clean_markdown_formatting(f"ಪ್ರಸ್ತುತ {crop_name} ಮಾರುಕಟ್ಟೆ ದರ ₹{curr_price}/ಕ್ವಿಂಟಾಲ್. 7 ದಿನಗಳ ಅಂದಾಜು ದರ ₹{pred_price}/ಕ್ವಿಂಟಾಲ್. ಸಲಹೆ: {decision_val}.")
        else:
            return clean_markdown_formatting(f"The current market price for {crop_name} is ₹{curr_price}/quintal. 7-day predicted price is ₹{pred_price}/quintal. Recommended strategy: {decision_val}.")
    elif any(k in q for k in ["today", "do", "action", "should", "आज", "काम", "ಇಂದು", "ಮಾಡಬೇಕು"]):
        if language == "hi":
            return clean_markdown_formatting(f"आज {crop_name} के लिए आवश्यक कार्य:\n1. {disease_name} प्रभावित पत्तियों की छंटाई करें।\n2. कॉपर फफूंदनाशक या मैंकोज़ेब का छिड़काव करें।\n3. जल निकासी सुचारू रखें।")
        elif language == "kn":
            return clean_markdown_formatting(f"ಇಂದು {crop_name} ಬೆಳೆಗೆ ಮಾಡಬೇಕಾದ ಕೆಲಸಗಳು:\n1. {disease_name} ರೋಗಪೀಡಿತ ಎಲೆಗಳನ್ನು ತೆಗೆದುಹಾಕಿ.\n2. ಸೂಕ್ತ ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಿಸಿ.")
        else:
            return clean_markdown_formatting(f"Action items for {crop_name} today:\n1. Prune foliage showing {disease_name} symptoms.\n2. Apply recommended fungicide during morning hours.\n3. Ensure effective field drainage.")
    elif any(k in q for k in ["yield", "loss", "damage", "risk", "नुकसान", "पैदावार", "ನಷ್ಟ", "ಇಳುವರಿ"]):
        if language == "hi":
            return clean_markdown_formatting(f"{crop_name} में {disease_name} ({severity_level}) के कारण 15-25% पैदावार नुकसान की संभावना है। समय पर फफूंदनाशक छिड़काव से नुकसान रोका जा सकता है।")
        elif language == "kn":
            return clean_markdown_formatting(f"{crop_name} ಬೆಳೆಯಲ್ಲಿ {disease_name} ಕಾರಣದಿಂದ ಅಂದಾಜು 15-25% ಇಳುವರಿ ನಷ್ಟ ಸಾಧ್ಯತೆ ಇದೆ. ತಕ್ಷಣ ಚಿಕಿತ್ಸೆ ನೀಡಿ.")
        else:
            return clean_markdown_formatting(f"With {severity_level} severity of {disease_name} on {crop_name}, estimated yield loss is 15-25% if untreated. Prompt fungicide application will minimize damage.")
    else:
        if language == "hi":
            return clean_markdown_formatting(f"आपकी {crop_name} फसल ({disease_name}) के लिए सलाह: प्रभावित पत्तियों को हटाएं, कॉपर फफूंदनाशक छिड़कें, और मंडी भाव (₹{curr_price}/क्विंटल) देखकर बिक्री का निर्णय लें।")
        elif language == "kn":
            return clean_markdown_formatting(f"ನಿಮ್ಮ {crop_name} ಬೆಳೆಗೆ ({disease_name}) ಕೃಷಿ ಸಲಹೆ: ರೋಗಪೀಡಿತ ಭಾಗಗಳನ್ನು ತೆಗೆದುಹಾಕಿ ಮತ್ತು ಮಾರುಕಟ್ಟೆ ದರ (₹{curr_price}) ಗಮನಿಸಿ.")
        else:
            return clean_markdown_formatting(f"Advice for your {crop_name} ({disease_name}): Prune infected leaf spots, apply copper fungicide, and monitor market prices (₹{curr_price}/quintal) to decide the best sell date.")
