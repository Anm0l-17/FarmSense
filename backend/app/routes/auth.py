from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database.session import get_db
from app.database.models import User
from app.schemas.auth import UserRegister, UserLogin, UserUpdate, TokenResponse, UserResponse
from app.utils.security import hash_password, verify_password, create_access_token, get_current_user

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.phone == user_data.phone).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Phone number already registered"
        )
    
    new_user = User(
        name=user_data.name,
        phone=user_data.phone,
        password_hash=hash_password(user_data.password),
        location=user_data.location or "Bangalore",
        preferred_language=user_data.preferred_language or "en"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token(data={"sub": new_user.user_id})
    return TokenResponse(
        user_id=new_user.user_id,
        name=new_user.name,
        phone=new_user.phone,
        location=new_user.location,
        preferred_language=new_user.preferred_language,
        token=token
    )

@router.post("/login", response_model=TokenResponse)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.phone == credentials.phone).first()
    if not user or not verify_password(credentials.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid phone number or password"
        )

    token = create_access_token(data={"sub": user.user_id})
    return TokenResponse(
        user_id=user.user_id,
        name=user.name,
        phone=user.phone,
        location=user.location,
        preferred_language=user.preferred_language,
        token=token
    )

@router.get("/me", response_model=UserResponse)
def get_profile(current_user: User = Depends(get_current_user)):
    return current_user

@router.put("/me", response_model=UserResponse)
def update_profile(
    user_update: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if user_update.name is not None:
        current_user.name = user_update.name
    if user_update.location is not None:
        current_user.location = user_update.location
    if user_update.preferred_language is not None:
        current_user.preferred_language = user_update.preferred_language
    if user_update.phone is not None and user_update.phone != current_user.phone:
        existing = db.query(User).filter(User.phone == user_update.phone).first()
        if existing:
            raise HTTPException(status_code=400, detail="Phone number already in use")
        current_user.phone = user_update.phone
    if user_update.password is not None and user_update.password.strip():
        current_user.password_hash = hash_password(user_update.password)
        
    db.commit()
    db.refresh(current_user)
    return current_user
