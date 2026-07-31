from datetime import datetime, timedelta
from sqlalchemy.orm import Session
from app.database.models import CommunityPost, CommunityAnswer, User
from app.services.llm_service import generate_ai_response
from app.utils.security import hash_password

PRESEEDED_QA = [
    {
        "author": "Ramesh Patil",
        "phone": "9876500001",
        "crop": "Tomato",
        "question": "How often should I spray fungicide for early blight on tomato crops?",
        "ai_answer": "For Early Blight on tomatoes, spray Mancozeb or copper-based fungicide every 7 to 10 days during humid weather. Always remove infected lower leaves to reduce spore buildup.",
        "human_answers": [
            {"author": "Sita Devi", "phone": "9876500002", "text": "I used Copper Oxychloride last season and it saved 80% of my harvest. Make sure to spray underneath the leaves as well."}
        ]
    },
    {
        "author": "Suresh Kumar",
        "phone": "9876500003",
        "crop": "Potato",
        "question": "My potato crop leaves are turning black after continuous heavy rain. What disease is this?",
        "ai_answer": "Blackening leaves after rainfall is a classic sign of Late Blight (Phytophthora infestans). Apply systemic fungicides like Metalaxyl immediately and improve field drainage.",
        "human_answers": [
            {"author": "Vikram Singh", "phone": "9876500004", "text": "Check your drainage ditches right away! Standing water makes late blight spread across the field within 24 hours."}
        ]
    },
    {
        "author": "Basavaraj Gowda",
        "phone": "9876500005",
        "crop": "Rice",
        "question": "Yellowing tips on paddy leaves in North Karnataka region - how to treat?",
        "ai_answer": "Yellowing leaf tips in paddy often indicate Zinc deficiency or Bacterial Leaf Blight. Apply 25 kg/hectare Zinc Sulphate or check for bacterial water-soaked lesions.",
        "human_answers": [
            {"author": "Manjunath K", "phone": "9876500006", "text": "Foliar spray of 0.5% Zinc Sulphate solution with 1% urea gives visible greening within 4-5 days."}
        ]
    },
    {
        "author": "Anil Shinde",
        "phone": "9876500007",
        "crop": "Onion",
        "question": "What is the best way to store onions to prevent rot while holding for better market prices?",
        "ai_answer": "Cure onions in a well-ventilated dry shade for 10-14 days until necks are completely dry. Store in wooden crates or mesh bags with continuous air circulation at 65-70% humidity.",
        "human_answers": [
            {"author": "Prakash Pawar", "phone": "9876500008", "text": "Never store wet onions. We keep ours on raised bamboo structures with bottom ventilation and lose under 5% over 3 months."}
        ]
    },
    {
        "author": "Gurpreet Singh",
        "phone": "9876500009",
        "crop": "Wheat",
        "question": "How to control yellow rust in wheat during cool damp weather?",
        "ai_answer": "Yellow rust spreads rapidly in cool humid climates. Spray Propiconazole 25% EC @ 1 ml per liter of water at the first appearance of yellow stripe symptoms.",
        "human_answers": [
            {"author": "Harpreet Kaur", "phone": "9876500010", "text": "Act fast when you spot yellow powder on upper leaves. One timely spray of Propiconazole stops the rust outbreak completely."}
        ]
    }
]

def seed_community_data(db: Session):
    existing_posts = db.query(CommunityPost).count()
    if existing_posts > 0:
        return

    print("Seeding pre-answered Community Q&A posts...")
    now = datetime.utcnow()

    for idx, item in enumerate(PRESEEDED_QA):
        # Ensure author user exists
        user = db.query(User).filter(User.phone == item["phone"]).first()
        if not user:
            user = User(
                name=item["author"],
                phone=item["phone"],
                password_hash=hash_password("demo1234"),
                location="Bangalore",
                preferred_language="en"
            )
            db.add(user)
            db.commit()
            db.refresh(user)

        post_time = now - timedelta(hours=(idx + 1) * 3)
        post = CommunityPost(
            user_id=user.user_id,
            crop=item["crop"],
            question=item["question"],
            created_at=post_time
        )
        db.add(post)
        db.commit()
        db.refresh(post)

        # AI Answer
        ai_answer = CommunityAnswer(
            post_id=post.post_id,
            user_id=None,
            answer=item["ai_answer"],
            is_ai_generated=True,
            created_at=post_time + timedelta(seconds=5)
        )
        db.add(ai_answer)

        # Human Answers
        for h_idx, ans in enumerate(item["human_answers"]):
            h_user = db.query(User).filter(User.phone == ans["phone"]).first()
            if not h_user:
                h_user = User(
                    name=ans["author"],
                    phone=ans["phone"],
                    password_hash=hash_password("demo1234"),
                    location="Bangalore",
                    preferred_language="en"
                )
                db.add(h_user)
                db.commit()
                db.refresh(h_user)

            human_ans = CommunityAnswer(
                post_id=post.post_id,
                user_id=h_user.user_id,
                answer=ans["text"],
                is_ai_generated=False,
                created_at=post_time + timedelta(minutes=(h_idx + 1) * 15)
            )
            db.add(human_ans)

        db.commit()

    print("Community Q&A seeded successfully with 5 pre-answered discussions!")

def create_post_with_ai_answer(db: Session, user: User, crop: str, question: str) -> dict:
    post = CommunityPost(
        user_id=user.user_id,
        crop=crop.capitalize(),
        question=question
    )
    db.add(post)
    db.commit()
    db.refresh(post)

    # Auto-generate AI Answer
    prompt = f"A farmer asks regarding {crop}: '{question}'. Provide a helpful 2-sentence answer."
    ai_text = generate_ai_response(message=prompt, language=user.preferred_language or "en")

    ai_answer = CommunityAnswer(
        post_id=post.post_id,
        user_id=None,  # AI answer
        answer=ai_text,
        is_ai_generated=True
    )
    db.add(ai_answer)
    db.commit()
    db.refresh(ai_answer)

    return {
        "post_id": post.post_id,
        "crop": post.crop,
        "question": post.question,
        "created_at": post.created_at,
        "ai_answer": {
            "answer_id": ai_answer.answer_id,
            "user_name": "AgriSense AI",
            "answer": ai_answer.answer,
            "is_ai_generated": True,
            "created_at": ai_answer.created_at
        }
    }

def add_human_answer(db: Session, user: User, post_id: str, answer_text: str) -> CommunityAnswer:
    answer = CommunityAnswer(
        post_id=post_id,
        user_id=user.user_id,
        answer=answer_text,
        is_ai_generated=False
    )
    db.add(answer)
    db.commit()
    db.refresh(answer)
    return answer
