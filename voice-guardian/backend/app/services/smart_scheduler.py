from datetime import datetime, timedelta
from typing import List, Dict, Optional
import json

class SmartScheduler:
    """AI-powered smart scheduling service"""
    
    def __init__(self, calendar_service):
        self.calendar_service = calendar_service
    
    def find_optimal_meeting_time(
        self,
        attendees: List[str],
        duration_minutes: int = 60,
        preferred_times: List[str] = None,
        timezone: str = "America/New_York",
        days_ahead: int = 14
    ) -> Dict:
        """Find the optimal meeting time for multiple attendees"""
        
        try:
            # Get free/busy information for all attendees
            attendee_schedules = []
            for attendee in attendees:
                schedule = self._get_attendee_schedule(attendee, days_ahead)
                attendee_schedules.append(schedule)
            
            # Find common free slots
            optimal_slots = self._find_common_free_slots(
                attendee_schedules,
                duration_minutes,
                preferred_times
            )
            
            # Rank slots by preference
            ranked_slots = self._rank_time_slots(optimal_slots, preferred_times)
            
            return {
                "success": True,
                "optimal_slots": ranked_slots[:5],  # Top 5 options
                "total_attendees": len(attendees),
                "duration_minutes": duration_minutes
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Smart scheduling failed: {str(e)}"
            }
    
    def suggest_meeting_reschedule(
        self,
        event_id: str,
        reason: str = "conflict",
        new_preferences: Dict = None
    ) -> Dict:
        """Suggest rescheduling options for an existing meeting"""
        
        try:
            # Get current event details
            event = self.calendar_service.get_event(event_id)
            if not event:
                return {"success": False, "error": "Event not found"}
            
            # Extract attendees
            attendees = [att.get('email') for att in event.get('attendees', [])]
            
            # Find new optimal times
            reschedule_options = self.find_optimal_meeting_time(
                attendees=attendees,
                duration_minutes=self._get_duration_minutes(event),
                preferred_times=new_preferences.get('times') if new_preferences else None
            )
            
            if reschedule_options['success']:
                return {
                    "success": True,
                    "current_event": {
                        "title": event.get('summary'),
                        "start": event.get('start'),
                        "attendees": attendees
                    },
                    "reschedule_options": reschedule_options['optimal_slots'],
                    "reason": reason
                }
            else:
                return reschedule_options
                
        except Exception as e:
            return {
                "success": False,
                "error": f"Reschedule suggestion failed: {str(e)}"
            }
    
    def analyze_meeting_patterns(
        self,
        user_id: str,
        days_back: int = 30
    ) -> Dict:
        """Analyze user's meeting patterns for insights"""
        
        try:
            # Get recent meetings
            end_date = datetime.utcnow()
            start_date = end_date - timedelta(days=days_back)
            
            meetings = self.calendar_service.list_events(
                time_min=start_date.isoformat(),
                time_max=end_date.isoformat()
            )
            
            if not meetings.get('success'):
                return {"success": False, "error": "Failed to fetch meetings"}
            
            # Analyze patterns
            patterns = self._analyze_meeting_data(meetings['events'])
            
            return {
                "success": True,
                "patterns": patterns,
                "analysis_period": f"{days_back} days",
                "total_meetings": len(meetings['events'])
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Pattern analysis failed: {str(e)}"
            }
    
    def _get_attendee_schedule(self, attendee_email: str, days_ahead: int) -> Dict:
        """Get schedule for a specific attendee"""
        # This would integrate with calendar APIs for each attendee
        # For now, return mock data
        return {
            "email": attendee_email,
            "busy_times": [],
            "preferences": {
                "working_hours": "09:00-17:00",
                "timezone": "America/New_York"
            }
        }
    
    def _find_common_free_slots(
        self,
        attendee_schedules: List[Dict],
        duration_minutes: int,
        preferred_times: List[str] = None
    ) -> List[Dict]:
        """Find time slots when all attendees are free"""
        
        # Mock implementation - in production, this would:
        # 1. Parse each attendee's busy times
        # 2. Find overlapping free periods
        # 3. Filter by working hours
        # 4. Consider timezone differences
        
        # For now, return some mock optimal slots
        base_time = datetime.utcnow().replace(hour=9, minute=0, second=0, microsecond=0)
        
        slots = []
        for i in range(5):
            slot_time = base_time + timedelta(days=i, hours=2*i)
            slots.append({
                "start_time": slot_time.isoformat(),
                "end_time": (slot_time + timedelta(minutes=duration_minutes)).isoformat(),
                "confidence": 0.9 - (i * 0.1),  # Decreasing confidence
                "attendee_availability": {
                    "all_free": True,
                    "conflicts": []
                }
            })
        
        return slots
    
    def _rank_time_slots(
        self,
        slots: List[Dict],
        preferred_times: List[str] = None
    ) -> List[Dict]:
        """Rank time slots by preference and availability"""
        
        # Add ranking logic based on:
        # - Preferred times
        # - Working hours
        # - Attendee availability
        # - Historical preferences
        
        for i, slot in enumerate(slots):
            slot['rank'] = i + 1
            slot['reason'] = f"Optimal slot #{i+1}"
        
        return sorted(slots, key=lambda x: x['confidence'], reverse=True)
    
    def _get_duration_minutes(self, event: Dict) -> int:
        """Extract duration from event"""
        start = datetime.fromisoformat(event['start']['dateTime'].replace('Z', '+00:00'))
        end = datetime.fromisoformat(event['end']['dateTime'].replace('Z', '+00:00'))
        return int((end - start).total_seconds() / 60)
    
    def _analyze_meeting_data(self, meetings: List[Dict]) -> Dict:
        """Analyze meeting patterns and provide insights"""
        
        if not meetings:
            return {"insights": "No meetings found in the analysis period"}
        
        # Analyze meeting frequency
        meeting_days = set()
        total_duration = 0
        meeting_types = {}
        
        for meeting in meetings:
            start_time = datetime.fromisoformat(meeting['start']['dateTime'].replace('Z', '+00:00'))
            end_time = datetime.fromisoformat(meeting['end']['dateTime'].replace('Z', '+00:00'))
            
            meeting_days.add(start_time.date())
            total_duration += (end_time - start_time).total_seconds() / 3600  # Hours
            
            # Categorize meeting types
            title = meeting.get('summary', '').lower()
            if 'standup' in title or 'daily' in title:
                meeting_types['standup'] = meeting_types.get('standup', 0) + 1
            elif 'review' in title:
                meeting_types['review'] = meeting_types.get('review', 0) + 1
            elif 'planning' in title:
                meeting_types['planning'] = meeting_types.get('planning', 0) + 1
            else:
                meeting_types['other'] = meeting_types.get('other', 0) + 1
        
        return {
            "total_meetings": len(meetings),
            "meeting_days": len(meeting_days),
            "avg_meetings_per_day": len(meetings) / max(len(meeting_days), 1),
            "total_meeting_hours": round(total_duration, 2),
            "avg_meeting_duration": round(total_duration / len(meetings), 2),
            "meeting_types": meeting_types,
            "insights": [
                f"You have {len(meetings)} meetings over {len(meeting_days)} days",
                f"Average {round(len(meetings) / max(len(meeting_days), 1), 1)} meetings per day",
                f"Total meeting time: {round(total_duration, 1)} hours",
                f"Most common meeting type: {max(meeting_types.items(), key=lambda x: x[1])[0] if meeting_types else 'N/A'}"
            ]
        }


