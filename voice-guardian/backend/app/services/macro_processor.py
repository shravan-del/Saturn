from datetime import datetime
from typing import List, Dict, Optional
import json
import re

class MacroProcessor:
    """Process voice macros and workflow automation"""
    
    def __init__(self, db_session, action_executor):
        self.db = db_session
        self.action_executor = action_executor
    
    def process_voice_macro(
        self,
        user_id: str,
        voice_command: str
    ) -> Dict:
        """Process voice command against user's macros"""
        
        try:
            # Get user's active macros
            from app.models import VoiceMacro
            macros = self.db.query(VoiceMacro).filter(
                VoiceMacro.user_id == user_id,
                VoiceMacro.is_active == True
            ).all()
            
            # Check for macro matches
            matched_macro = self._find_matching_macro(voice_command, macros)
            
            if matched_macro:
                return self._execute_macro(matched_macro, voice_command)
            else:
                return {
                    "success": False,
                    "matched": False,
                    "message": "No matching macro found"
                }
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Macro processing failed: {str(e)}"
            }
    
    def create_voice_macro(
        self,
        user_id: str,
        name: str,
        trigger_phrase: str,
        actions: List[Dict]
    ) -> Dict:
        """Create a new voice macro"""
        
        try:
            from app.models import VoiceMacro
            
            # Validate actions
            if not self._validate_actions(actions):
                return {
                    "success": False,
                    "error": "Invalid actions configuration"
                }
            
            # Create macro
            macro = VoiceMacro(
                user_id=user_id,
                name=name,
                trigger_phrase=trigger_phrase,
                actions=actions
            )
            
            self.db.add(macro)
            self.db.commit()
            self.db.refresh(macro)
            
            return {
                "success": True,
                "macro": {
                    "id": macro.id,
                    "name": macro.name,
                    "trigger_phrase": macro.trigger_phrase,
                    "actions": macro.actions,
                    "created_at": macro.created_at
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Macro creation failed: {str(e)}"
            }
    
    def execute_workflow_template(
        self,
        user_id: str,
        template_id: str,
        context: Dict = None
    ) -> Dict:
        """Execute a workflow template"""
        
        try:
            from app.models import WorkflowTemplate
            
            # Get template
            template = self.db.query(WorkflowTemplate).filter(
                WorkflowTemplate.id == template_id,
                WorkflowTemplate.is_active == True
            ).first()
            
            if not template:
                return {
                    "success": False,
                    "error": "Workflow template not found"
                }
            
            # Execute workflow steps
            results = []
            for step in template.steps:
                step_result = self._execute_workflow_step(step, context or {})
                results.append(step_result)
            
            return {
                "success": True,
                "workflow_results": results,
                "template_name": template.name
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Workflow execution failed: {str(e)}"
            }
    
    def _find_matching_macro(
        self,
        voice_command: str,
        macros: List
    ) -> Optional[object]:
        """Find macro that matches the voice command"""
        
        command_lower = voice_command.lower()
        
        for macro in macros:
            trigger_lower = macro.trigger_phrase.lower()
            
            # Exact match
            if trigger_lower == command_lower:
                return macro
            
            # Partial match (contains)
            if trigger_lower in command_lower:
                return macro
            
            # Fuzzy match using keywords
            trigger_words = set(trigger_lower.split())
            command_words = set(command_lower.split())
            
            # If 70% of trigger words are in command
            overlap = len(trigger_words.intersection(command_words))
            if len(trigger_words) > 0 and overlap / len(trigger_words) >= 0.7:
                return macro
        
        return None
    
    def _execute_macro(self, macro, voice_command: str) -> Dict:
        """Execute a matched macro"""
        
        try:
            results = []
            
            for action in macro.actions:
                action_result = self._execute_macro_action(action, voice_command)
                results.append(action_result)
            
            return {
                "success": True,
                "matched": True,
                "macro_name": macro.name,
                "trigger_phrase": macro.trigger_phrase,
                "execution_results": results
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Macro execution failed: {str(e)}"
            }
    
    def _execute_macro_action(self, action: Dict, context: str) -> Dict:
        """Execute a single macro action"""
        
        action_type = action.get('type')
        
        if action_type == 'create_calendar_event':
            return self._create_calendar_event_action(action, context)
        elif action_type == 'send_email':
            return self._send_email_action(action, context)
        elif action_type == 'create_note':
            return self._create_note_action(action, context)
        elif action_type == 'set_reminder':
            return self._set_reminder_action(action, context)
        elif action_type == 'execute_workflow':
            return self._execute_workflow_action(action, context)
        else:
            return {
                "success": False,
                "error": f"Unknown action type: {action_type}"
            }
    
    def _create_calendar_event_action(self, action: Dict, context: str) -> Dict:
        """Execute calendar event creation"""
        
        try:
            # Extract parameters from action config
            title = self._resolve_template(action.get('title', ''), context)
            when = self._resolve_template(action.get('when', ''), context)
            duration = action.get('duration_minutes', 60)
            description = self._resolve_template(action.get('description', ''), context)
            
            # Use the action executor to create the event
            result = self.action_executor.create_calendar_event(
                title=title,
                when=when,
                duration_minutes=duration,
                description=description
            )
            
            return {
                "action_type": "create_calendar_event",
                "success": result.get('success', False),
                "result": result
            }
            
        except Exception as e:
            return {
                "action_type": "create_calendar_event",
                "success": False,
                "error": str(e)
            }
    
    def _send_email_action(self, action: Dict, context: str) -> Dict:
        """Execute email sending"""
        
        try:
            to = self._resolve_template(action.get('to', ''), context)
            subject = self._resolve_template(action.get('subject', ''), context)
            body = self._resolve_template(action.get('body', ''), context)
            
            # Use the action executor to send email
            result = self.action_executor.send_email(
                to=to,
                subject=subject,
                body=body
            )
            
            return {
                "action_type": "send_email",
                "success": result.get('success', False),
                "result": result
            }
            
        except Exception as e:
            return {
                "action_type": "send_email",
                "success": False,
                "error": str(e)
            }
    
    def _create_note_action(self, action: Dict, context: str) -> Dict:
        """Execute note creation"""
        
        try:
            title = self._resolve_template(action.get('title', ''), context)
            content = self._resolve_template(action.get('content', ''), context)
            
            # Create note in database
            from app.models import Action
            note_action = Action(
                user_id=action.get('user_id'),
                intent_type='create_note',
                title=title,
                description=content,
                status='completed'
            )
            
            self.db.add(note_action)
            self.db.commit()
            
            return {
                "action_type": "create_note",
                "success": True,
                "note_id": note_action.id
            }
            
        except Exception as e:
            return {
                "action_type": "create_note",
                "success": False,
                "error": str(e)
            }
    
    def _set_reminder_action(self, action: Dict, context: str) -> Dict:
        """Execute reminder setting"""
        
        try:
            reminder_text = self._resolve_template(action.get('text', ''), context)
            when = self._resolve_template(action.get('when', ''), context)
            
            # Create reminder action
            from app.models import Action
            reminder_action = Action(
                user_id=action.get('user_id'),
                intent_type='create_reminder',
                title=reminder_text,
                entities={'when': when},
                status='completed'
            )
            
            self.db.add(reminder_action)
            self.db.commit()
            
            return {
                "action_type": "set_reminder",
                "success": True,
                "reminder_id": reminder_action.id
            }
            
        except Exception as e:
            return {
                "action_type": "set_reminder",
                "success": False,
                "error": str(e)
            }
    
    def _execute_workflow_action(self, action: Dict, context: str) -> Dict:
        """Execute a workflow"""
        
        try:
            workflow_id = action.get('workflow_id')
            if not workflow_id:
                return {
                    "action_type": "execute_workflow",
                    "success": False,
                    "error": "No workflow ID provided"
                }
            
            # Execute the workflow
            result = self.execute_workflow_template(
                user_id=action.get('user_id'),
                template_id=workflow_id,
                context=context
            )
            
            return {
                "action_type": "execute_workflow",
                "success": result.get('success', False),
                "result": result
            }
            
        except Exception as e:
            return {
                "action_type": "execute_workflow",
                "success": False,
                "error": str(e)
            }
    
    def _resolve_template(self, template: str, context: str) -> str:
        """Resolve template variables with context"""
        
        # Simple template resolution
        # Replace {context} with the voice command context
        resolved = template.replace('{context}', context)
        
        # Replace {date} with current date
        resolved = resolved.replace('{date}', datetime.now().strftime('%Y-%m-%d'))
        
        # Replace {time} with current time
        resolved = resolved.replace('{time}', datetime.now().strftime('%H:%M'))
        
        return resolved
    
    def _validate_actions(self, actions: List[Dict]) -> bool:
        """Validate macro actions configuration"""
        
        if not actions or not isinstance(actions, list):
            return False
        
        for action in actions:
            if not isinstance(action, dict):
                return False
            
            if 'type' not in action:
                return False
            
            # Validate action type
            valid_types = [
                'create_calendar_event',
                'send_email',
                'create_note',
                'set_reminder',
                'execute_workflow'
            ]
            
            if action['type'] not in valid_types:
                return False
        
        return True
    
    def _execute_workflow_step(self, step: Dict, context: Dict) -> Dict:
        """Execute a single workflow step"""
        
        step_type = step.get('type')
        
        if step_type == 'condition':
            return self._execute_condition_step(step, context)
        elif step_type == 'action':
            return self._execute_action_step(step, context)
        elif step_type == 'delay':
            return self._execute_delay_step(step, context)
        else:
            return {
                "success": False,
                "error": f"Unknown step type: {step_type}"
            }
    
    def _execute_condition_step(self, step: Dict, context: Dict) -> Dict:
        """Execute a conditional step"""
        
        condition = step.get('condition', {})
        condition_type = condition.get('type')
        
        if condition_type == 'contains':
            field = condition.get('field')
            value = condition.get('value')
            context_value = context.get(field, '')
            
            result = value.lower() in context_value.lower()
        elif condition_type == 'equals':
            field = condition.get('field')
            value = condition.get('value')
            context_value = context.get(field, '')
            
            result = value.lower() == context_value.lower()
        else:
            result = False
        
        return {
            "step_type": "condition",
            "success": True,
            "result": result,
            "condition_met": result
        }
    
    def _execute_action_step(self, step: Dict, context: Dict) -> Dict:
        """Execute an action step"""
        
        action = step.get('action', {})
        return self._execute_macro_action(action, str(context))
    
    def _execute_delay_step(self, step: Dict, context: Dict) -> Dict:
        """Execute a delay step"""
        
        delay_seconds = step.get('delay_seconds', 0)
        
        # In production, you might want to use async delays
        # For now, just return success
        return {
            "step_type": "delay",
            "success": True,
            "delay_seconds": delay_seconds
        }


