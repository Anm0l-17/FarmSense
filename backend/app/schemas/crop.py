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
    yield_loss: Optional[float] = 18.0
    description: Optional[str] = "Fungal infection affecting plant foliage."
    symptoms: Optional[List[str]] = ["Dark brown leaf spots", "Concentric ring lesions"]
    actions: Optional[List[str]] = ["Remove infected leaves", "Apply fungicide spray"]
    revenue_impact: Optional[List[int]] = [4500, 8000]
    created_at: datetime

class DiagnosisHistoryResponse(BaseModel):
    total: int
    diagnoses: List[DiagnosisResponse]
