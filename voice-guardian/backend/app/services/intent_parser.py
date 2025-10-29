from openai import OpenAI
from app.config import settings
import json

class IntentParser:
    SYSTEM_PROMPT = """You are an intent parser for a voice assistant. Extract structured actions.

Output STRICT JSON:
{
  "intent_type": "create_event|send_email|create_task|general",
  "confidence": 0.0-1.0,
  "entities": {
    "title": "string",
    "when": "ISO8601 or relative like 'tomorrow 2pm'",
    "duration_minutes": 60,
    "description": "string"
  }
}

For MVP, focus on calendar events. Mark non-calendar commands as "general" with low confidence.
"""
    
    def __init__(self):
        self.client = OpenAI(api_key=settings.OPENAI_API_KEY)
    
    def parse(self, command: str) -> dict:
        print(f"IntentParser: Parsing command: {command}")
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": self.SYSTEM_PROMPT},
                    {"role": "user", "content": f"Command: {command}"}
                ],
                response_format={"type": "json_object"},
                temperature=0.3,
                max_tokens=500
            )
            
            result = json.loads(response.choices[0].message.content)
            print(f"IntentParser: OpenAI response: {result}")
            return result
        except Exception as e:
            print(f"IntentParser: Error: {e}")
            # Fallback to simple rule-based parsing
            return self._fallback_parse(command)
    
    def _fallback_parse(self, command: str) -> dict:
        """Simple rule-based parsing when OpenAI is unavailable"""
        command_lower = command.lower()
        
        # Check for calendar-related keywords
        calendar_keywords = ['schedule', 'meeting', 'appointment', 'event', 'calendar', 'book', 'create']
        time_keywords = ['tomorrow', 'today', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday', 'am', 'pm', 'morning', 'afternoon', 'evening']
        
        has_calendar = any(keyword in command_lower for keyword in calendar_keywords)
        has_time = any(keyword in command_lower for keyword in time_keywords)
        
        if has_calendar and has_time:
            # Extract basic info
            title = "Meeting" if "meeting" in command_lower else "Event"
            when = "tomorrow" if "tomorrow" in command_lower else "today"
            
            return {
                "intent_type": "create_event",
                "confidence": 0.8,
                "entities": {
                    "title": title,
                    "when": when,
                    "duration_minutes": 60,
                    "description": command
                }
            }
        elif has_calendar:
            return {
                "intent_type": "create_event",
                "confidence": 0.6,
                "entities": {
                    "title": "Event",
                    "when": "today",
                    "duration_minutes": 60,
                    "description": command
                }
            }
        else:
            return {
                "intent_type": "general",
                "confidence": 0.3,
                "entities": {
                    "title": "Untitled",
                    "description": command
                }
            }
