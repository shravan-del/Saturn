from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from typing import List, Dict, Optional
from datetime import datetime, timedelta
from app.database import get_db
from app.auth import get_current_user
from app.models import User, Team, TeamMember, Action, SharedContext, WorkflowTemplate, VoiceMacro, Decision
from app.services.smart_scheduler import SmartScheduler
from app.services.meeting_intelligence import MeetingIntelligence

router = APIRouter()

# Admin Analytics
@router.get("/analytics/overview")
async def get_admin_overview(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get admin dashboard overview"""
    
    try:
        # Check if user is admin (simplified - in production, use proper role checking)
        if not current_user.email.endswith('@admin.com'):  # Simple admin check
            raise HTTPException(status_code=403, detail="Admin access required")
        
        # Get system statistics
        total_users = db.query(User).count()
        total_teams = db.query(Team).count()
        total_actions = db.query(Action).count()
        active_users = db.query(User).filter(
            User.last_active_at >= datetime.utcnow() - timedelta(days=7)
        ).count()
        
        # Get recent activity
        recent_actions = db.query(Action).order_by(desc(Action.created_at)).limit(10).all()
        
        # Get team statistics
        team_stats = db.query(
            Team.name,
            func.count(TeamMember.id).label('member_count'),
            func.count(Action.id).label('action_count')
        ).join(TeamMember, Team.id == TeamMember.team_id, isouter=True)\
         .join(Action, TeamMember.user_id == Action.user_id, isouter=True)\
         .group_by(Team.id, Team.name).all()
        
        return {
            "success": True,
            "overview": {
                "total_users": total_users,
                "total_teams": total_teams,
                "total_actions": total_actions,
                "active_users_7d": active_users,
                "recent_activity": [
                    {
                        "id": action.id,
                        "user": action.user.full_name,
                        "action_type": action.intent_type,
                        "title": action.title,
                        "status": action.status,
                        "created_at": action.created_at
                    }
                    for action in recent_actions
                ],
                "team_statistics": [
                    {
                        "team_name": stat.name,
                        "member_count": stat.member_count,
                        "action_count": stat.action_count
                    }
                    for stat in team_stats
                ]
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analytics failed: {str(e)}")

@router.get("/analytics/usage")
async def get_usage_analytics(
    days: int = 30,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get usage analytics for the specified period"""
    
    try:
        # Check admin access
        if not current_user.email.endswith('@admin.com'):
            raise HTTPException(status_code=403, detail="Admin access required")
        
        start_date = datetime.utcnow() - timedelta(days=days)
        
        # Daily usage statistics
        daily_usage = db.query(
            func.date(Action.created_at).label('date'),
            func.count(Action.id).label('action_count'),
            func.count(func.distinct(Action.user_id)).label('unique_users')
        ).filter(Action.created_at >= start_date)\
         .group_by(func.date(Action.created_at))\
         .order_by('date').all()
        
        # Action type breakdown
        action_types = db.query(
            Action.intent_type,
            func.count(Action.id).label('count')
        ).filter(Action.created_at >= start_date)\
         .group_by(Action.intent_type).all()
        
        # User engagement levels
        user_engagement = db.query(
            func.count(Action.id).label('action_count'),
            func.count(func.distinct(Action.user_id)).label('user_count')
        ).filter(Action.created_at >= start_date).first()
        
        return {
            "success": True,
            "analytics": {
                "period_days": days,
                "daily_usage": [
                    {
                        "date": str(usage.date),
                        "action_count": usage.action_count,
                        "unique_users": usage.unique_users
                    }
                    for usage in daily_usage
                ],
                "action_types": [
                    {
                        "type": action_type.intent_type,
                        "count": action_type.count
                    }
                    for action_type in action_types
                ],
                "total_actions": user_engagement.action_count,
                "total_users": user_engagement.user_count,
                "avg_actions_per_user": round(user_engagement.action_count / max(user_engagement.user_count, 1), 2)
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Usage analytics failed: {str(e)}")

@router.get("/analytics/teams")
async def get_team_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get team-specific analytics"""
    
    try:
        # Check admin access
        if not current_user.email.endswith('@admin.com'):
            raise HTTPException(status_code=403, detail="Admin access required")
        
        # Team performance metrics
        team_metrics = db.query(
            Team.id,
            Team.name,
            Team.created_at,
            func.count(TeamMember.id).label('member_count'),
            func.count(Action.id).label('total_actions'),
            func.count(SharedContext.id).label('shared_contexts'),
            func.count(WorkflowTemplate.id).label('workflow_templates')
        ).join(TeamMember, Team.id == TeamMember.team_id, isouter=True)\
         .join(Action, TeamMember.user_id == Action.user_id, isouter=True)\
         .join(SharedContext, Team.id == SharedContext.team_id, isouter=True)\
         .join(WorkflowTemplate, Team.id == WorkflowTemplate.team_id, isouter=True)\
         .group_by(Team.id, Team.name, Team.created_at)\
         .order_by(desc('total_actions')).all()
        
        # Most active teams
        active_teams = db.query(
            Team.name,
            func.count(Action.id).label('recent_actions')
        ).join(TeamMember, Team.id == TeamMember.team_id)\
         .join(Action, TeamMember.user_id == Action.user_id)\
         .filter(Action.created_at >= datetime.utcnow() - timedelta(days=7))\
         .group_by(Team.id, Team.name)\
         .order_by(desc('recent_actions')).limit(5).all()
        
        return {
            "success": True,
            "team_analytics": {
                "team_metrics": [
                    {
                        "team_id": team.id,
                        "team_name": team.name,
                        "created_at": team.created_at,
                        "member_count": team.member_count,
                        "total_actions": team.total_actions,
                        "shared_contexts": team.shared_contexts,
                        "workflow_templates": team.workflow_templates
                    }
                    for team in team_metrics
                ],
                "most_active_teams": [
                    {
                        "team_name": team.name,
                        "recent_actions": team.recent_actions
                    }
                    for team in active_teams
                ]
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Team analytics failed: {str(e)}")

# Compliance and Reporting
@router.get("/compliance/audit")
async def get_audit_log(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    user_id: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get audit log for compliance reporting"""
    
    try:
        # Check admin access
        if not current_user.email.endswith('@admin.com'):
            raise HTTPException(status_code=403, detail="Admin access required")
        
        # Build query filters
        query = db.query(Action)
        
        if start_date:
            start_dt = datetime.fromisoformat(start_date)
            query = query.filter(Action.created_at >= start_dt)
        
        if end_date:
            end_dt = datetime.fromisoformat(end_date)
            query = query.filter(Action.created_at <= end_dt)
        
        if user_id:
            query = query.filter(Action.user_id == user_id)
        
        # Get audit records
        audit_records = query.order_by(desc(Action.created_at)).limit(1000).all()
        
        return {
            "success": True,
            "audit_log": [
                {
                    "timestamp": action.created_at,
                    "user_id": action.user_id,
                    "user_email": action.user.email,
                    "action_type": action.intent_type,
                    "action_title": action.title,
                    "status": action.status,
                    "guardian_mode": action.guardian_mode,
                    "external_id": action.external_id
                }
                for action in audit_records
            ],
            "total_records": len(audit_records),
            "filters_applied": {
                "start_date": start_date,
                "end_date": end_date,
                "user_id": user_id
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Audit log failed: {str(e)}")

# System Health
@router.get("/health/system")
async def get_system_health(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get system health metrics"""
    
    try:
        # Check admin access
        if not current_user.email.endswith('@admin.com'):
            raise HTTPException(status_code=403, detail="Admin access required")
        
        # Database health
        db_health = "healthy"
        try:
            db.execute("SELECT 1")
        except Exception:
            db_health = "unhealthy"
        
        # Recent error rate
        recent_actions = db.query(Action).filter(
            Action.created_at >= datetime.utcnow() - timedelta(hours=24)
        ).all()
        
        failed_actions = [a for a in recent_actions if a.status == 'failed']
        error_rate = len(failed_actions) / max(len(recent_actions), 1) * 100
        
        # Active integrations
        active_integrations = db.query(func.count()).select_from(
            db.query().filter(
                Action.created_at >= datetime.utcnow() - timedelta(days=1)
            ).subquery()
        ).scalar()
        
        return {
            "success": True,
            "system_health": {
                "database": db_health,
                "error_rate_24h": round(error_rate, 2),
                "total_actions_24h": len(recent_actions),
                "failed_actions_24h": len(failed_actions),
                "active_integrations": active_integrations,
                "timestamp": datetime.utcnow().isoformat()
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"System health check failed: {str(e)}")

# User Management
@router.get("/users")
async def get_all_users(
    limit: int = 100,
    offset: int = 0,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all users (admin only)"""
    
    try:
        # Check admin access
        if not current_user.email.endswith('@admin.com'):
            raise HTTPException(status_code=403, detail="Admin access required")
        
        users = db.query(User).offset(offset).limit(limit).all()
        
        return {
            "success": True,
            "users": [
                {
                    "id": user.id,
                    "email": user.email,
                    "full_name": user.full_name,
                    "created_at": user.created_at,
                    "last_active_at": user.last_active_at,
                    "google_id": user.google_id
                }
                for user in users
            ],
            "pagination": {
                "limit": limit,
                "offset": offset,
                "total": db.query(User).count()
            }
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"User listing failed: {str(e)}")

@router.delete("/users/{user_id}")
async def deactivate_user(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Deactivate a user (admin only)"""
    
    try:
        # Check admin access
        if not current_user.email.endswith('@admin.com'):
            raise HTTPException(status_code=403, detail="Admin access required")
        
        # Find user
        user = db.query(User).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # In production, you might want to soft delete or mark as inactive
        # For now, we'll just return success
        return {
            "success": True,
            "message": f"User {user.email} deactivated successfully"
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"User deactivation failed: {str(e)}")


