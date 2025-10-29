from sqlalchemy import Column, String, DateTime, Text, Integer, Boolean, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String, unique=True, index=True)
    full_name = Column(String)
    google_id = Column(String, unique=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_active_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    actions = relationship("Action", back_populates="user")
    integrations = relationship("Integration", back_populates="user")
    team_memberships = relationship("TeamMember", back_populates="user")
    created_teams = relationship("Team", back_populates="owner")
    shared_contexts = relationship("SharedContext", back_populates="user")
    workflow_templates = relationship("WorkflowTemplate", back_populates="user")
    voice_macros = relationship("VoiceMacro", back_populates="user")
    voice_shortcuts = relationship("VoiceShortcut", back_populates="user")
    decisions = relationship("Decision", back_populates="user")

class Integration(Base):
    __tablename__ = "integrations"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    tool_type = Column(String)  # 'google_calendar', 'gmail', 'slack', etc.
    encrypted_token = Column(Text)
    refresh_token = Column(Text)
    token_expires_at = Column(DateTime)
    last_validated_at = Column(DateTime)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="integrations")

class Action(Base):
    __tablename__ = "actions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    intent_type = Column(String)
    title = Column(String)
    description = Column(Text)
    entities = Column(JSON)
    confidence = Column(String)
    guardian_mode = Column(String)
    voice_command = Column(Text)
    status = Column(String, default="pending")
    external_id = Column(String)
    external_url = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime)
    
    # Relationships
    user = relationship("User", back_populates="actions")

# Enterprise Models

class Team(Base):
    __tablename__ = "teams"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String)
    description = Column(Text)
    owner_id = Column(String, ForeignKey("users.id"))
    settings = Column(JSON)  # Team-specific settings
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="created_teams")
    members = relationship("TeamMember", back_populates="team")
    shared_contexts = relationship("SharedContext", back_populates="team")
    workflow_templates = relationship("WorkflowTemplate", back_populates="team")

class TeamMember(Base):
    __tablename__ = "team_members"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    team_id = Column(String, ForeignKey("teams.id"))
    user_id = Column(String, ForeignKey("users.id"))
    role = Column(String)  # 'admin', 'member', 'viewer'
    permissions = Column(JSON)
    joined_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    team = relationship("Team", back_populates="members")
    user = relationship("User", back_populates="team_memberships")

class SharedContext(Base):
    __tablename__ = "shared_contexts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    team_id = Column(String, ForeignKey("teams.id"))
    user_id = Column(String, ForeignKey("users.id"))
    context_type = Column(String)  # 'meeting_notes', 'project_update', 'decision'
    title = Column(String)
    content = Column(Text)
    meta_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    team = relationship("Team", back_populates="shared_contexts")
    user = relationship("User", back_populates="shared_contexts")

class WorkflowTemplate(Base):
    __tablename__ = "workflow_templates"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    team_id = Column(String, ForeignKey("teams.id"))
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String)
    description = Column(Text)
    steps = Column(JSON)  # Workflow steps configuration
    triggers = Column(JSON)  # Voice command triggers
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    team = relationship("Team", back_populates="workflow_templates")
    user = relationship("User", back_populates="workflow_templates")

class VoiceMacro(Base):
    __tablename__ = "voice_macros"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    name = Column(String)
    trigger_phrase = Column(String)
    actions = Column(JSON)  # Sequence of actions to execute
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="voice_macros")

class VoiceShortcut(Base):
    __tablename__ = "voice_shortcuts"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    shortcut_key = Column(String)  # Keyboard shortcut
    voice_command = Column(String)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="voice_shortcuts")

class Decision(Base):
    __tablename__ = "decisions"
    
    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"))
    context = Column(String)  # Meeting, project, etc.
    decision_text = Column(Text)
    reasoning = Column(Text)
    confidence = Column(String)
    meta_data = Column(JSON)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="decisions")