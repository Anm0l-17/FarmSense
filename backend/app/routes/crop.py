import os
import uuid
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from sqlalchemy.orm import Session
from typing import Optional
from app.database.session import get_db
from app.database.models import CropDiagnosis, User
from app.schemas.crop import DiagnosisResponse, DiagnosisHistoryResponse
from app.services.disease_service import diagnose_image
from app.utils.security import get_current_user

router = APIRouter(prefix="/crop", tags=["Crop Diagnosis"])

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/diagnose", response_model=DiagnosisResponse, status_code=status.HTTP_201_CREATED)
async def create_diagnosis(
    image: UploadFile = File(...),
    crop_hint: Optional[str] = Form(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not image.content_type.startswith("image/"):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File uploaded must be an image (JPG/PNG)"
        )
    
    contents = await image.read()
    
    # Save file locally
    filename = f"{uuid.uuid4()}_{image.filename}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as f:
        f.write(contents)
    
    image_url = f"/uploads/{filename}"

    # Perform diagnosis
    try:
        diag_result = diagnose_image(contents, crop_hint=crop_hint)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Image processing failed: {str(e)}")

    # Store in database
    db_diagnosis = CropDiagnosis(
        user_id=current_user.user_id,
        crop=diag_result["crop"],
        disease=diag_result["disease"],
        confidence=diag_result["confidence"],
        severity=diag_result["severity"],
        image_url=image_url
    )
    db.add(db_diagnosis)
    db.commit()
    db.refresh(db_diagnosis)

    return db_diagnosis

@router.get("/history", response_model=DiagnosisHistoryResponse)
def get_diagnosis_history(
    limit: int = 20,
    offset: int = 0,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(CropDiagnosis).filter(CropDiagnosis.user_id == current_user.user_id)
    total = query.count()
    diagnoses = query.order_by(CropDiagnosis.created_at.desc()).offset(offset).limit(limit).all()
    
    return DiagnosisHistoryResponse(total=total, diagnoses=diagnoses)

@router.get("/{diagnosis_id}", response_model=DiagnosisResponse)
def get_diagnosis(
    diagnosis_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    diag = db.query(CropDiagnosis).filter(
        CropDiagnosis.diagnosis_id == diagnosis_id,
        CropDiagnosis.user_id == current_user.user_id
    ).first()
    
    if not diag:
        raise HTTPException(status_code=404, detail="Diagnosis not found")
    return diag
