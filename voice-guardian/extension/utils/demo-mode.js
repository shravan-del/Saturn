const DemoMode = {
  isEnabled() {
    try {
      if (typeof Storage !== 'undefined' && Storage.get) return false;
      return localStorage.getItem('demo_mode') === 'true';
    } catch (e) {
      return false;
    }
  },

  async mockCalendarCreate(eventDetails) {
    await new Promise(r => setTimeout(r, 800));
    return {
      success: true,
      event_id: 'demo_' + Date.now(),
      event_url: 'https://calendar.google.com/calendar/',
      event: {
        title: (eventDetails && eventDetails.title) || 'Demo Event',
        start: (eventDetails && eventDetails.start) || new Date().toISOString(),
        end: (eventDetails && eventDetails.end) || new Date(Date.now() + 3600000).toISOString()
      }
    };
  },

  async mockAuthCheck() {
    await new Promise(r => setTimeout(r, 300));
    return {
      authenticated: true,
      user: { email: 'demo@voiceguardian.com', name: 'Demo User' }
    };
  },

  async mockIntentParse(command) {
    await new Promise(r => setTimeout(r, 500));
    return {
      intent_type: 'create_event',
      confidence: 0.85,
      entities: {
        title: 'Demo Meeting',
        when: 'tomorrow 2pm',
        duration_minutes: 60,
        description: command
      }
    };
  }
};

if (typeof window !== 'undefined') window.DemoMode = DemoMode;
if (typeof module !== 'undefined' && module.exports) module.exports = DemoMode;
