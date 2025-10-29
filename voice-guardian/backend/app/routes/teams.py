from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from app.database import get_db
from app.auth import get_current_user
from app.models import User, Team, TeamMember, SharedContext, WorkflowTemplate
from datetime import datetime

router = APIRouter()

# Pydantic models
class TeamCreate(BaseModel):
    name: str
    description: Optional[str] = None
    settings: Optional[dict] = None

class TeamMemberAdd(BaseModel):
    user_email: str
    role: str = "member"
    permissions: Optional[dict] = None

class SharedContextCreate(BaseModel):
    context_type: str
    title: str
    content: str
    metadata: Optional[dict] = None

class WorkflowTemplateCreate(BaseModel):
    name: str
    description: Optional[str] = None
    steps: dict
    triggers: dict

# Team Management
@router.post("/teams")
async def create_team(
    team_data: TeamCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new team"""
    
    team = Team(
        name=team_data.name,
        description=team_data.description,
        owner_id=current_user.id,
        settings=team_data.settings or {}
    )
    
    db.add(team)
    db.flush()
    
    # Add owner as admin member
    owner_member = TeamMember(
        team_id=team.id,
        user_id=current_user.id,
        role="admin",
        permissions={"all": True}
    )
    
    db.add(owner_member)
    db.commit()
    db.refresh(team)
    
    return {
        "success": True,
        "team": {
            "id": team.id,
            "name": team.name,
            "description": team.description,
            "owner_id": team.owner_id,
            "created_at": team.created_at
        }
    }

@router.get("/teams")
async def get_user_teams(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all teams for the current user"""
    
    # Get teams where user is a member
    teams = db.query(Team).join(TeamMember).filter(
        TeamMember.user_id == current_user.id
    ).all()
    
    return {
        "teams": [
            {
                "id": team.id,
                "name": team.name,
                "description": team.description,
                "owner_id": team.owner_id,
                "member_count": len(team.members),
                "created_at": team.created_at
            }
            for team in teams
        ]
    }

@router.post("/teams/{team_id}/members")
async def add_team_member(
    team_id: str,
    member_data: TeamMemberAdd,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Add a member to a team"""
    
    # Check if current user is admin of the team
    team_membership = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == current_user.id,
        TeamMember.role == "admin"
    ).first()
    
    if not team_membership:
        raise HTTPException(status_code=403, detail="Only team admins can add members")
    
    # Find user by email
    user = db.query(User).filter(User.email == member_data.user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Check if user is already a member
    existing_member = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == user.id
    ).first()
    
    if existing_member:
        raise HTTPException(status_code=400, detail="User is already a team member")
    
    # Add member
    member = TeamMember(
        team_id=team_id,
        user_id=user.id,
        role=member_data.role,
        permissions=member_data.permissions or {}
    )
    
    db.add(member)
    db.commit()
    
    return {
        "success": True,
        "message": f"Added {user.full_name} to the team"
    }

# Shared Context
@router.post("/teams/{team_id}/context")
async def create_shared_context(
    team_id: str,
    context_data: SharedContextCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create shared context for a team"""
    
    # Check if user is a team member
    team_membership = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == current_user.id
    ).first()
    
    if not team_membership:
        raise HTTPException(status_code=403, detail="You are not a member of this team")
    
    context = SharedContext(
        team_id=team_id,
        user_id=current_user.id,
        context_type=context_data.context_type,
        title=context_data.title,
        content=context_data.content,
        metadata=context_data.metadata or {}
    )
    
    db.add(context)
    db.commit()
    db.refresh(context)
    
    return {
        "success": True,
        "context": {
            "id": context.id,
            "title": context.title,
            "content": context.content,
            "context_type": context.context_type,
            "created_at": context.created_at
        }
    }

@router.get("/teams/{team_id}/context")
async def get_team_context(
    team_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get shared context for a team"""
    
    # Check if user is a team member
    team_membership = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == current_user.id
    ).first()
    
    if not team_membership:
        raise HTTPException(status_code=403, detail="You are not a member of this team")
    
    contexts = db.query(SharedContext).filter(
        SharedContext.team_id == team_id
    ).order_by(SharedContext.created_at.desc()).all()
    
    return {
        "contexts": [
            {
                "id": context.id,
                "title": context.title,
                "content": context.content,
                "context_type": context.context_type,
                "created_by": context.user.full_name,
                "created_at": context.created_at
            }
            for context in contexts
        ]
    }

# Workflow Templates
@router.post("/teams/{team_id}/workflows")
async def create_workflow_template(
    team_id: str,
    workflow_data: WorkflowTemplateCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a workflow template for a team"""
    
    # Check if user is a team member
    team_membership = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == current_user.id
    ).first()
    
    if not team_membership:
        raise HTTPException(status_code=403, detail="You are not a member of this team")
    
    workflow = WorkflowTemplate(
        team_id=team_id,
        user_id=current_user.id,
        name=workflow_data.name,
        description=workflow_data.description,
        steps=workflow_data.steps,
        triggers=workflow_data.triggers
    )
    
    db.add(workflow)
    db.commit()
    db.refresh(workflow)
    
    return {
        "success": True,
        "workflow": {
            "id": workflow.id,
            "name": workflow.name,
            "description": workflow.description,
            "steps": workflow.steps,
            "triggers": workflow.triggers,
            "created_at": workflow.created_at
        }
    }

@router.get("/teams/{team_id}/workflows")
async def get_team_workflows(
    team_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get workflow templates for a team"""
    
    # Check if user is a team member
    team_membership = db.query(TeamMember).filter(
        TeamMember.team_id == team_id,
        TeamMember.user_id == current_user.id
    ).first()
    
    if not team_membership:
        raise HTTPException(status_code=403, detail="You are not a member of this team")
    
    workflows = db.query(WorkflowTemplate).filter(
        WorkflowTemplate.team_id == team_id,
        WorkflowTemplate.is_active == True
    ).order_by(WorkflowTemplate.created_at.desc()).all()
    
    return {
        "workflows": [
            {
                "id": workflow.id,
                "name": workflow.name,
                "description": workflow.description,
                "steps": workflow.steps,
                "triggers": workflow.triggers,
                "created_by": workflow.user.full_name,
                "created_at": workflow.created_at
            }
            for workflow in workflows
        ]
    }


