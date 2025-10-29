from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.auth import get_current_user
from app.models import User, Action
from app.services.intent_parser import IntentParser
from app.services.guardian import GuardianService

router = APIRouter()
intent_parser = IntentParser()
guardian = GuardianService()

class VoiceCommandRequest(BaseModel):
    command: str

@router.post("/command")
async def process_command(
    request: VoiceCommandRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Process voice command and create action"""
    
    # Parse intent
    intent = intent_parser.parse(request.command)
    
    # Guardian check
    guardian_result = guardian.check_action(intent)
    
    # Create action record
    action = Action(
        user_id=current_user.id,
        intent_type=intent['intent_type'],
        title=intent['entities'].get('title', 'Untitled'),
        description=intent['entities'].get('description'),
        entities=intent['entities'],
        confidence=intent['confidence'],
        guardian_mode=guardian_result['mode'],
        voice_command=request.command,
        status='pending'
    )
    
    db.add(action)
    db.commit()
    db.refresh(action)
    
    return {
        "action_id": action.id,
        "intent": intent,
        "guardian": guardian_result,
        "requires_confirmation": guardian_result['mode'] == 'confirm'
    }


