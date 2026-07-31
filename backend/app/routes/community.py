from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import Optional
from app.database.session import get_db
from app.database.models import CommunityPost, CommunityAnswer, User
from app.schemas.community import (
    PostCreate, PostCreateResponse, PostListResponse, PostSummaryResponse,
    PostDetailResponse, AnswerCreate, AnswerResponse
)
from app.services.community_service import create_post_with_ai_answer, add_human_answer
from app.utils.security import get_current_user

router = APIRouter(prefix="/community", tags=["Community Q&A"])

@router.get("/posts", response_model=PostListResponse)
def get_posts(
    crop: Optional[str] = Query(None),
    search: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    query = db.query(CommunityPost)
    if crop:
        query = query.filter(CommunityPost.crop.ilike(f"%{crop}%"))
    if search:
        query = query.filter(CommunityPost.question.ilike(f"%{search}%"))
        
    total = query.count()
    posts = query.order_by(CommunityPost.created_at.desc()).offset(offset).limit(limit).all()

    post_summaries = []
    for p in posts:
        ans_count = db.query(CommunityAnswer).filter(CommunityAnswer.post_id == p.post_id).count()
        user_name = p.user.name if p.user else "Farmer"
        post_summaries.append(PostSummaryResponse(
            post_id=p.post_id,
            user_name=user_name,
            crop=p.crop,
            question=p.question,
            answer_count=ans_count,
            created_at=p.created_at
        ))

    return PostListResponse(total=total, posts=post_summaries)

@router.get("/posts/{post_id}", response_model=PostDetailResponse)
def get_post_detail(
    post_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(CommunityPost).filter(CommunityPost.post_id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    answers = db.query(CommunityAnswer).filter(CommunityAnswer.post_id == post_id).order_by(CommunityAnswer.created_at.asc()).all()

    formatted_answers = []
    for a in answers:
        name = "AgriSense AI" if a.is_ai_generated or not a.user else a.user.name
        formatted_answers.append(AnswerResponse(
            answer_id=a.answer_id,
            user_name=name,
            answer=a.answer,
            is_ai_generated=a.is_ai_generated,
            created_at=a.created_at
        ))

    return PostDetailResponse(
        post_id=post.post_id,
        user_name=post.user.name if post.user else "Farmer",
        crop=post.crop,
        question=post.question,
        answers=formatted_answers,
        created_at=post.created_at
    )

@router.post("/posts", response_model=PostCreateResponse, status_code=status.HTTP_201_CREATED)
def create_post(
    req: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    res = create_post_with_ai_answer(
        db=db,
        user=current_user,
        crop=req.crop,
        question=req.question
    )
    return res

@router.post("/posts/{post_id}/answers", response_model=AnswerResponse, status_code=status.HTTP_201_CREATED)
def create_answer(
    post_id: str,
    req: AnswerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    post = db.query(CommunityPost).filter(CommunityPost.post_id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
        
    ans = add_human_answer(db=db, user=current_user, post_id=post_id, answer_text=req.answer)
    
    return AnswerResponse(
        answer_id=ans.answer_id,
        user_name=current_user.name,
        answer=ans.answer,
        is_ai_generated=False,
        created_at=ans.created_at
    )
