import re
from datetime import datetime

class GuardianService:
    
    def check_action(self, action: dict) -> dict:
        """Simple rule-based validation for MVP"""
        print(f"Guardian: Checking action: {action}")
        
        risk_score = 0.0
        warnings = []
        blockers = []
        
        confidence = action.get("confidence", 1.0)
        print(f"Guardian: Confidence: {confidence}")
        
        # Low confidence check
        if confidence < 0.4:
            blockers.append({
                "type": "low_confidence",
                "message": "Command is too unclear. Please be more specific."
            })
            risk_score += 0.8
        elif confidence < 0.7:
            warnings.append({
                "type": "moderate_confidence",
                "message": "I'm not 100% sure I understood correctly."
            })
            risk_score += 0.3
        
        # Check if calendar event makes sense
        intent_type = action.get("intent_type")
        if intent_type == "create_event":
            entities = action.get("entities", {})
            
            if not entities.get("title"):
                blockers.append({
                    "type": "missing_title",
                    "message": "Event needs a title"
                })
                risk_score += 0.5
            
            if not entities.get("when"):
                blockers.append({
                    "type": "missing_time",
                    "message": "When should this event be scheduled?"
                })
                risk_score += 0.5
        
        # Determine mode
        if blockers:
            mode = "block"
        elif risk_score < 0.3:
            mode = "auto"
        else:
            mode = "confirm"
        
        return {
            "mode": mode,
            "confidence": confidence,
            "risk_score": min(risk_score, 1.0),
            "warnings": warnings,
            "blockers": blockers,
            "preview": self._generate_preview(action)
        }
    
    def _generate_preview(self, action: dict) -> str:
        """Generate human-readable preview"""
        intent_type = action.get("intent_type")
        entities = action.get("entities", {})
        
        if intent_type == "create_event":
            title = entities.get("title", "Untitled")
            when = entities.get("when", "unspecified time")
            duration = entities.get("duration_minutes", 60)
            
            return f"I'll create a {duration}-minute event '{title}' at {when}"
        
        return f"I'll {intent_type}: {entities.get('title', 'Untitled')}"
