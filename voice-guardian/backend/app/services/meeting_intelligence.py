from datetime import datetime, timedelta
from typing import List, Dict, Optional
import json
import re

class MeetingIntelligence:
    """AI-powered meeting intelligence and analysis"""
    
    def __init__(self, openai_client=None):
        self.openai_client = openai_client
    
    def analyze_meeting_transcript(
        self,
        transcript: str,
        meeting_metadata: Dict = None
    ) -> Dict:
        """Analyze meeting transcript for insights and action items"""
        
        try:
            # Extract key information using AI
            analysis = self._extract_meeting_insights(transcript)
            
            # Identify action items
            action_items = self._extract_action_items(transcript)
            
            # Generate summary
            summary = self._generate_meeting_summary(transcript, analysis)
            
            # Identify decisions made
            decisions = self._extract_decisions(transcript)
            
            # Find follow-up items
            follow_ups = self._identify_follow_ups(transcript)
            
            return {
                "success": True,
                "analysis": {
                    "summary": summary,
                    "key_topics": analysis.get('topics', []),
                    "participants": analysis.get('participants', []),
                    "sentiment": analysis.get('sentiment', 'neutral'),
                    "action_items": action_items,
                    "decisions": decisions,
                    "follow_ups": follow_ups,
                    "meeting_metadata": meeting_metadata or {}
                }
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Meeting analysis failed: {str(e)}"
            }
    
    def generate_meeting_notes(
        self,
        transcript: str,
        template: str = "standard"
    ) -> Dict:
        """Generate structured meeting notes from transcript"""
        
        try:
            # Choose template
            if template == "standup":
                notes = self._generate_standup_notes(transcript)
            elif template == "retrospective":
                notes = self._generate_retrospective_notes(transcript)
            elif template == "planning":
                notes = self._generate_planning_notes(transcript)
            else:
                notes = self._generate_standard_notes(transcript)
            
            return {
                "success": True,
                "notes": notes,
                "template_used": template
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Note generation failed: {str(e)}"
            }
    
    def extract_action_items(
        self,
        transcript: str,
        assignee_detection: bool = True
    ) -> Dict:
        """Extract and structure action items from meeting transcript"""
        
        try:
            # Use regex patterns to find action items
            action_patterns = [
                r"(?:action item|todo|task|follow.?up|next step)s?[:\s]*(.+?)(?:\.|$)",
                r"(?:we need to|let's|should|will)\s+(.+?)(?:\.|$)",
                r"(?:assigned to|@\w+)\s+(.+?)(?:\.|$)",
                r"(?:deadline|due|by)\s+(.+?)(?:\.|$)"
            ]
            
            action_items = []
            for pattern in action_patterns:
                matches = re.findall(pattern, transcript, re.IGNORECASE | re.MULTILINE)
                for match in matches:
                    action_items.append({
                        "description": match.strip(),
                        "confidence": 0.8,
                        "source": "pattern_matching"
                    })
            
            # If OpenAI is available, use it for better extraction
            if self.openai_client:
                ai_actions = self._extract_actions_with_ai(transcript)
                action_items.extend(ai_actions)
            
            # Remove duplicates and rank by confidence
            unique_actions = self._deduplicate_actions(action_items)
            ranked_actions = sorted(unique_actions, key=lambda x: x['confidence'], reverse=True)
            
            return {
                "success": True,
                "action_items": ranked_actions,
                "total_count": len(ranked_actions)
            }
            
        except Exception as e:
            return {
                "success": False,
                "error": f"Action item extraction failed: {str(e)}"
            }
    
    def _extract_meeting_insights(self, transcript: str) -> Dict:
        """Extract key insights from meeting transcript"""
        
        # Mock implementation - in production, this would use AI
        topics = self._extract_topics(transcript)
        participants = self._extract_participants(transcript)
        sentiment = self._analyze_sentiment(transcript)
        
        return {
            "topics": topics,
            "participants": participants,
            "sentiment": sentiment,
            "duration_estimate": self._estimate_meeting_duration(transcript)
        }
    
    def _extract_topics(self, transcript: str) -> List[str]:
        """Extract main topics discussed"""
        # Simple keyword extraction - in production, use NLP/AI
        common_topics = [
            "project update", "budget", "timeline", "resources", "risks",
            "next steps", "deadlines", "team", "client", "product"
        ]
        
        found_topics = []
        for topic in common_topics:
            if topic.lower() in transcript.lower():
                found_topics.append(topic)
        
        return found_topics[:5]  # Top 5 topics
    
    def _extract_participants(self, transcript: str) -> List[str]:
        """Extract participant names from transcript"""
        # Simple name extraction - in production, use NLP
        name_patterns = [
            r"(?:@|mentioned)\s+(\w+)",
            r"(?:says|said|thinks|believes)\s+(\w+)",
            r"(\w+)\s+(?:says|said|thinks|believes)"
        ]
        
        participants = set()
        for pattern in name_patterns:
            matches = re.findall(pattern, transcript, re.IGNORECASE)
            participants.update(matches)
        
        return list(participants)[:10]  # Top 10 participants
    
    def _analyze_sentiment(self, transcript: str) -> str:
        """Analyze overall meeting sentiment"""
        # Simple sentiment analysis - in production, use AI
        positive_words = ["good", "great", "excellent", "progress", "success", "achieved"]
        negative_words = ["problem", "issue", "concern", "risk", "delay", "blocked"]
        
        positive_count = sum(1 for word in positive_words if word in transcript.lower())
        negative_count = sum(1 for word in negative_words if word in transcript.lower())
        
        if positive_count > negative_count:
            return "positive"
        elif negative_count > positive_count:
            return "negative"
        else:
            return "neutral"
    
    def _estimate_meeting_duration(self, transcript: str) -> int:
        """Estimate meeting duration based on transcript length"""
        # Rough estimate: 150 words per minute
        word_count = len(transcript.split())
        return max(15, word_count // 150)  # Minimum 15 minutes
    
    def _extract_action_items(self, transcript: str) -> List[Dict]:
        """Extract action items from transcript"""
        return self.extract_action_items(transcript)['action_items']
    
    def _generate_meeting_summary(self, transcript: str, analysis: Dict) -> str:
        """Generate a concise meeting summary"""
        topics = analysis.get('topics', [])
        participants = analysis.get('participants', [])
        
        summary = f"Meeting attended by {len(participants)} participants. "
        if topics:
            summary += f"Key topics discussed: {', '.join(topics[:3])}. "
        
        # Add action items count
        action_items = self._extract_action_items(transcript)
        if action_items:
            summary += f"{len(action_items)} action items identified."
        
        return summary
    
    def _extract_decisions(self, transcript: str) -> List[Dict]:
        """Extract decisions made during the meeting"""
        decision_patterns = [
            r"(?:decided|agreed|concluded|resolved)\s+(.+?)(?:\.|$)",
            r"(?:decision|conclusion|resolution)\s*[:\s]*(.+?)(?:\.|$)"
        ]
        
        decisions = []
        for pattern in decision_patterns:
            matches = re.findall(pattern, transcript, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                decisions.append({
                    "decision": match.strip(),
                    "confidence": 0.7
                })
        
        return decisions
    
    def _identify_follow_ups(self, transcript: str) -> List[Dict]:
        """Identify follow-up items and next steps"""
        followup_patterns = [
            r"(?:follow.?up|next time|next meeting|continue)\s+(.+?)(?:\.|$)",
            r"(?:will|should|need to)\s+(.+?)(?:\.|$)"
        ]
        
        follow_ups = []
        for pattern in followup_patterns:
            matches = re.findall(pattern, transcript, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                follow_ups.append({
                    "item": match.strip(),
                    "confidence": 0.6
                })
        
        return follow_ups
    
    def _generate_standard_notes(self, transcript: str) -> Dict:
        """Generate standard meeting notes"""
        return {
            "meeting_type": "standard",
            "sections": {
                "attendees": self._extract_participants(transcript),
                "agenda_items": self._extract_topics(transcript),
                "discussion_points": self._extract_discussion_points(transcript),
                "action_items": self._extract_action_items(transcript),
                "next_meeting": self._extract_next_meeting_info(transcript)
            }
        }
    
    def _generate_standup_notes(self, transcript: str) -> Dict:
        """Generate standup meeting notes"""
        return {
            "meeting_type": "standup",
            "sections": {
                "yesterday": self._extract_yesterday_items(transcript),
                "today": self._extract_today_items(transcript),
                "blockers": self._extract_blockers(transcript)
            }
        }
    
    def _generate_retrospective_notes(self, transcript: str) -> Dict:
        """Generate retrospective meeting notes"""
        return {
            "meeting_type": "retrospective",
            "sections": {
                "what_went_well": self._extract_positive_items(transcript),
                "what_could_improve": self._extract_improvement_items(transcript),
                "action_items": self._extract_action_items(transcript)
            }
        }
    
    def _generate_planning_notes(self, transcript: str) -> Dict:
        """Generate planning meeting notes"""
        return {
            "meeting_type": "planning",
            "sections": {
                "goals": self._extract_goals(transcript),
                "timeline": self._extract_timeline(transcript),
                "resources": self._extract_resources(transcript),
                "risks": self._extract_risks(transcript)
            }
        }
    
    def _extract_actions_with_ai(self, transcript: str) -> List[Dict]:
        """Use AI to extract action items (if OpenAI client available)"""
        if not self.openai_client:
            return []
        
        # This would use OpenAI to extract action items
        # For now, return empty list
        return []
    
    def _deduplicate_actions(self, actions: List[Dict]) -> List[Dict]:
        """Remove duplicate action items"""
        seen = set()
        unique_actions = []
        
        for action in actions:
            key = action['description'].lower().strip()
            if key not in seen:
                seen.add(key)
                unique_actions.append(action)
        
        return unique_actions
    
    # Helper methods for different note types
    def _extract_discussion_points(self, transcript: str) -> List[str]:
        return self._extract_topics(transcript)
    
    def _extract_next_meeting_info(self, transcript: str) -> str:
        return "Next meeting details to be determined"
    
    def _extract_yesterday_items(self, transcript: str) -> List[str]:
        return [item for item in self._extract_action_items(transcript) if 'yesterday' in item['description'].lower()]
    
    def _extract_today_items(self, transcript: str) -> List[str]:
        return [item for item in self._extract_action_items(transcript) if 'today' in item['description'].lower()]
    
    def _extract_blockers(self, transcript: str) -> List[str]:
        return [item for item in self._extract_action_items(transcript) if 'block' in item['description'].lower()]
    
    def _extract_positive_items(self, transcript: str) -> List[str]:
        return [item for item in self._extract_action_items(transcript) if any(word in item['description'].lower() for word in ['good', 'great', 'success', 'achieved'])]
    
    def _extract_improvement_items(self, transcript: str) -> List[str]:
        return [item for item in self._extract_action_items(transcript) if any(word in item['description'].lower() for word in ['improve', 'better', 'fix', 'issue'])]
    
    def _extract_goals(self, transcript: str) -> List[str]:
        return [item for item in self._extract_action_items(transcript) if any(word in item['description'].lower() for word in ['goal', 'objective', 'target', 'aim'])]
    
    def _extract_timeline(self, transcript: str) -> List[str]:
        return [item for item in self._extract_action_items(transcript) if any(word in item['description'].lower() for word in ['timeline', 'schedule', 'deadline', 'due'])]
    
    def _extract_resources(self, transcript: str) -> List[str]:
        return [item for item in self._extract_action_items(transcript) if any(word in item['description'].lower() for word in ['resource', 'budget', 'funding', 'staff'])]
    
    def _extract_risks(self, transcript: str) -> List[str]:
        return [item for item in self._extract_action_items(transcript) if any(word in item['description'].lower() for word in ['risk', 'concern', 'issue', 'problem'])]


