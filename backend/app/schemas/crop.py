from pydantic import BaseModel, ConfigDict
from typing import Optional, List
from datetime import datetime

class DiagnosisResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    diagnosis_id: str
    crop: str
    disease: str
    confidence: float
    severity: str
    image_url: Optional[str] = None
    created_at: datetime

class DiagnosisHistoryResponse(BaseModel):
    total: int
    diagnoses: List[DiagnosisResponse]
