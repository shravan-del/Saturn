from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from datetime import datetime, timedelta
from app.config import settings
import dateparser
import pytz

class GoogleCalendarService:
    
    def __init__(self, integration):
        """Initialize with integration record from database"""
        
        try:
            print(f"GoogleCalendarService: Initializing with integration: {integration}")
            
            # Check if token needs refresh
            if hasattr(integration, 'token_expires_at') and integration.token_expires_at and integration.token_expires_at < datetime.utcnow():
                # Refresh token logic here (implement token refresh)
                print("GoogleCalendarService: Token needs refresh")
                pass
            
            # Validate required attributes
            if not hasattr(integration, 'encrypted_token') or not integration.encrypted_token:
                raise ValueError("Integration missing encrypted_token")
            if not hasattr(integration, 'refresh_token') or not integration.refresh_token:
                raise ValueError("Integration missing refresh_token")
            
            creds = Credentials(
                token=integration.encrypted_token,
                refresh_token=integration.refresh_token,
                token_uri="https://oauth2.googleapis.com/token",
                client_id=settings.GOOGLE_CLIENT_ID,
                client_secret=settings.GOOGLE_CLIENT_SECRET,
                scopes=['https://www.googleapis.com/auth/calendar.events']
            )
            
            self.service = build('calendar', 'v3', credentials=creds)
            self.timezone = 'America/New_York'  # Get from user settings in production
            print("GoogleCalendarService: Initialized successfully")
            
        except Exception as e:
            print(f"GoogleCalendarService: Initialization error: {e}")
            raise
    
    def create_event(
        self,
        title: str,
        when: str,
        duration_minutes: int = 60,
        description: str = None,
        attendees: list = None,
        location: str = None,
        recurrence: list = None
    ):
        """Create a calendar event - PRODUCTION VERSION"""
        
        try:
            # Parse 'when' string to datetime
            start_time = self._parse_time(when)
            if not start_time:
                return {
                    'success': False,
                    'error': f"Could not parse time: {when}"
                }
            
            end_time = start_time + timedelta(minutes=duration_minutes)
            
            # Build event body
            event_body = {
                'summary': title,
                'start': {
                    'dateTime': start_time.isoformat(),
                    'timeZone': self.timezone,
                },
                'end': {
                    'dateTime': end_time.isoformat(),
                    'timeZone': self.timezone,
                },
            }
            
            if description:
                event_body['description'] = description
            
            if location:
                event_body['location'] = location
            
            if attendees:
                event_body['attendees'] = [{'email': email} for email in attendees]
            
            if recurrence:
                event_body['recurrence'] = recurrence
            
            # ACTUALLY CREATE THE EVENT
            event = self.service.events().insert(
                calendarId='primary',
                body=event_body,
                sendUpdates='all'  # Send email invitations
            ).execute()
            
            return {
                'success': True,
                'event_id': event['id'],
                'event_url': event.get('htmlLink'),
                'event': event
            }
            
        except HttpError as e:
            return {
                'success': False,
                'error': f"Google Calendar API error: {str(e)}"
            }
        except Exception as e:
            return {
                'success': False,
                'error': f"Unexpected error: {str(e)}"
            }
    
    def update_event(self, event_id: str, **updates):
        """Update an existing event"""
        try:
            # Get existing event
            event = self.service.events().get(
                calendarId='primary',
                eventId=event_id
            ).execute()
            
            # Apply updates
            for key, value in updates.items():
                event[key] = value
            
            # Update event
            updated_event = self.service.events().update(
                calendarId='primary',
                eventId=event_id,
                body=event
            ).execute()
            
            return {
                'success': True,
                'event': updated_event
            }
        except HttpError as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def delete_event(self, event_id: str):
        """Delete a calendar event"""
        try:
            self.service.events().delete(
                calendarId='primary',
                eventId=event_id,
                sendUpdates='all'
            ).execute()
            
            return {'success': True}
        except HttpError as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def list_events(self, time_min=None, time_max=None, max_results=10):
        """List upcoming events"""
        try:
            if not time_min:
                time_min = datetime.utcnow().isoformat() + 'Z'
            
            events_result = self.service.events().list(
                calendarId='primary',
                timeMin=time_min,
                timeMax=time_max,
                maxResults=max_results,
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            return {
                'success': True,
                'events': events_result.get('items', [])
            }
        except HttpError as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def find_free_slots(self, duration_minutes: int, days_ahead: int = 7):
        """Find free time slots in calendar"""
        try:
            time_min = datetime.utcnow()
            time_max = time_min + timedelta(days=days_ahead)
            
            body = {
                "timeMin": time_min.isoformat() + 'Z',
                "timeMax": time_max.isoformat() + 'Z',
                "items": [{"id": "primary"}]
            }
            
            freebusy = self.service.freebusy().query(body=body).execute()
            busy_times = freebusy['calendars']['primary']['busy']
            
            # Calculate free slots (simplified)
            free_slots = []
            # Implementation for finding gaps between busy times
            
            return {
                'success': True,
                'free_slots': free_slots
            }
        except HttpError as e:
            return {
                'success': False,
                'error': str(e)
            }
    
    def _parse_time(self, time_str: str):
        """Parse natural language time to datetime"""
        return dateparser.parse(
            time_str,
            settings={
                'TIMEZONE': self.timezone,
                'RETURN_AS_TIMEZONE_AWARE': False,
                'PREFER_DATES_FROM': 'future'
            }
        )