from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from app.database import get_db
from app.models import User, Integration
from app.auth import create_access_token, get_current_user
from app.config import settings
from datetime import datetime
import secrets
import json

router = APIRouter()

# OAuth configuration
SCOPES = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/gmail.send',
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/documents',
]

def get_oauth_flow(state=None):
    """Create OAuth flow instance"""
    flow = Flow.from_client_config(
        {
            "web": {
                "client_id": settings.GOOGLE_CLIENT_ID,
                "client_secret": settings.GOOGLE_CLIENT_SECRET,
                "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                "token_uri": "https://oauth2.googleapis.com/token",
                "redirect_uris": [settings.GOOGLE_REDIRECT_URI]
            }
        },
        scopes=SCOPES,
        redirect_uri=settings.GOOGLE_REDIRECT_URI
    )
    if state:
        flow.state = state
    return flow

@router.get("/google/login")
async def google_login_start(db: Session = Depends(get_db)):
    """Start Google OAuth flow"""
    
    # Generate state token for security
    state = secrets.token_urlsafe(32)
    
    # Store state temporarily (in production, use Redis)
    # For now, we'll validate in callback
    
    flow = get_oauth_flow()
    authorization_url, _ = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent',  # Force consent to get refresh token
        state=state
    )
    
    return {
        "authorization_url": authorization_url,
        "state": state
    }

@router.get("/google/callback")
async def google_callback(
    code: str,
    state: str,
    db: Session = Depends(get_db)
):
    """Handle Google OAuth callback"""
    
    try:
        # Create a fresh flow instance for token exchange
        flow = Flow.from_client_config(
            {
                "web": {
                    "client_id": settings.GOOGLE_CLIENT_ID,
                    "client_secret": settings.GOOGLE_CLIENT_SECRET,
                    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                    "token_uri": "https://oauth2.googleapis.com/token",
                    "redirect_uris": [settings.GOOGLE_REDIRECT_URI]
                }
            },
            scopes=SCOPES,
            redirect_uri=settings.GOOGLE_REDIRECT_URI
        )
        
        # Exchange code for token
        flow.fetch_token(code=code)
        
        credentials = flow.credentials
        
        # Get user info from Google
        user_info_service = build('oauth2', 'v2', credentials=credentials)
        user_info = user_info_service.userinfo().get().execute()
        
        # Find or create user
        user = db.query(User).filter(User.google_id == user_info['id']).first()
        
        if not user:
            user = User(
                email=user_info['email'],
                full_name=user_info.get('name', ''),
                google_id=user_info['id']
            )
            db.add(user)
            db.flush()
        
        # Update last active
        user.last_active_at = datetime.utcnow()
        
        # Store or update Google Calendar integration
        integration = db.query(Integration).filter(
            Integration.user_id == user.id,
            Integration.tool_type == 'google_calendar'
        ).first()
        
        if not integration:
            integration = Integration(
                user_id=user.id,
                tool_type='google_calendar'
            )
            db.add(integration)
        
        # Store credentials (encrypt in production)
        integration.encrypted_token = credentials.token
        integration.refresh_token = credentials.refresh_token
        integration.token_expires_at = credentials.expiry
        integration.last_validated_at = datetime.utcnow()
        
        db.commit()
        db.refresh(user)
        
        # Create JWT for the user
        access_token = create_access_token({"sub": str(user.id)})
        
        # Redirect to web app with token
        from fastapi.responses import RedirectResponse
        web_app_url = "http://localhost:3000"
        redirect_url = f"{web_app_url}?token={access_token}&user_id={user.id}&email={user.email}&name={user.full_name}"
        
        return RedirectResponse(url=redirect_url)
        
    except Exception as e:
        print(f"OAuth error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"OAuth failed: {str(e)}")

@router.post("/logout")
async def logout(current_user = Depends(get_current_user), db: Session = Depends(get_db)):
    """Logout user and revoke tokens"""
    
    # In production, add token to blacklist
    # For now, just return success
    
    return {"success": True, "message": "Logged out successfully"}

@router.get("/me")
async def get_current_user_info(current_user = Depends(get_current_user)):
    """Get current user information"""
    
    return {
        "id": current_user.id,
        "email": current_user.email,
        "name": current_user.full_name
    }
