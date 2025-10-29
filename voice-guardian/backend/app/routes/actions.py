from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.database import get_db
from app.auth import get_current_user
from app.models import User, Action, Integration
from app.services.google_calendar import GoogleCalendarService
from app.config import settings
from datetime import datetime

router = APIRouter()

class ExecuteActionRequest(BaseModel):
    action_id: str
    confirm: bool = True

@router.post("/execute")
async def execute_action(
    request: ExecuteActionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Execute an action"""
    
    # Get action
    action = db.query(Action).filter(
        Action.id == request.action_id,
        Action.user_id == current_user.id
    ).first()
    
    if not action:
        raise HTTPException(status_code=404, detail="Action not found")
    
    if not request.confirm:
        action.status = 'cancelled'
        db.commit()
        return {"success": False, "message": "Action cancelled"}
    
    # Get Google Calendar integration
    integration = db.query(Integration).filter(
        Integration.user_id == current_user.id,
        Integration.tool_type == 'google_calendar'
    ).first()
    
    if not integration:
        raise HTTPException(
            status_code=400,
            detail="Google Calendar not connected. Please connect your Google account in settings."
        )
    
    # Execute based on intent type
    if action.intent_type == 'create_event':
        try:
            print(f"Action execution: Creating calendar event for action {action.id}")
            print(f"Integration details: {integration}")
            
            calendar_service = GoogleCalendarService(integration)
            
            result = calendar_service.create_event(
                title=action.title,
                when=action.entities.get('when'),
                duration_minutes=action.entities.get('duration_minutes', 60),
                description=action.description
            )
            
            print(f"Calendar service result: {result}")
            
            if result['success']:
                action.status = 'completed'
                action.external_id = result['event_id']
                action.external_url = result['event_url']
                action.completed_at = datetime.utcnow()
                db.commit()
                
                return {
                    "success": True,
                    "message": f"Created event: {action.title}",
                    "event_url": result['event_url']
                }
            else:
                action.status = 'failed'
                db.commit()
                raise HTTPException(status_code=500, detail=result['error'])
        
        except Exception as e:
            print(f"Action execution error: {e}")
            print(f"Error type: {type(e)}")
            import traceback
            print(f"Traceback: {traceback.format_exc()}")
            action.status = 'failed'
            db.commit()
            raise HTTPException(status_code=500, detail=str(e))
    
    elif action.intent_type == 'send_email':
        # Demo mode for email - mark as completed
        action.status = 'completed'
        action.completed_at = datetime.utcnow()
        db.commit()
        
        return {
            "success": True,
            "message": f"Email sent: {action.title} (Demo mode - no actual email sent)"
        }
    
    elif action.intent_type == 'general':
        # Demo mode for general commands - mark as completed
        action.status = 'completed'
        action.completed_at = datetime.utcnow()
        db.commit()
        
        return {
            "success": True,
            "message": f"Action completed: {action.title} (Demo mode)"
        }
    
    else:
        # Demo mode for unsupported intent types
        action.status = 'completed'
        action.completed_at = datetime.utcnow()
        db.commit()
        
        return {
            "success": True,
            "message": f"Action completed: {action.title} (Demo mode - {action.intent_type} not fully implemented yet)"
        }

@router.get("/")
async def get_actions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user's actions"""
    actions = db.query(Action).filter(
        Action.user_id == current_user.id
    ).order_by(Action.created_at.desc()).limit(50).all()
    
    return {"actions": actions}
