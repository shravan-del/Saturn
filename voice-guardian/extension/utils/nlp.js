const EntityExtractor = {
  extractTitle(text) {
    if (!text || typeof text !== 'string') return 'Untitled';
    const t = text.trim();
    const calendar = /(?:schedule|book|create|add|set up)\s+(?:a\s+)?(?:meeting|event|appointment)?\s*(?:called|named|titled?)?\s*[:\-]?\s*([^.?!]+?)(?:\s+(?:tomorrow|today|monday|tuesday|wednesday|thursday|friday|saturday|sunday|next week|at\s+\d|\d{1,2}(?::\d{2})?\s*(?:am|pm)|in\s+\d))/i;
    const m = t.match(calendar);
    if (m && m[1]) return m[1].trim();
    const first = t.split(/\s+(?:tomorrow|today|at|on|next|in\s+\d)/i)[0];
    const words = (first || t).split(/\s+/).filter(Boolean);
    if (words.length <= 1) return words[0] || 'Meeting';
    return words.slice(0, 5).join(' ');
  },

  extractDateTime(text) {
    if (!text || typeof text !== 'string') return null;
    const lower = text.toLowerCase();
    const now = new Date();
    let date = new Date(now);
    date.setHours(0, 0, 0, 0);

    const today = /today|tonight/i;
    const tomorrow = /tomorrow/i;
    const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    let dayMatch = null;
    for (let i = 0; i < dayNames.length; i++) {
      if (lower.includes(dayNames[i])) { dayMatch = i; break; }
    }
    const timeRe = /(\d{1,2})(?::(\d{2}))?\s*(am|pm)?|noon|midnight/i;
    const timeMatch = text.match(timeRe);
    let hour = 9, minute = 0;
    if (timeMatch) {
      if (timeMatch[0].toLowerCase() === 'noon') { hour = 12; minute = 0; }
      else if (timeMatch[0].toLowerCase() === 'midnight') { hour = 0; minute = 0; }
      else {
        hour = parseInt(timeMatch[1], 10);
        minute = timeMatch[2] ? parseInt(timeMatch[2], 10) : 0;
        const pm = timeMatch[3] && timeMatch[3].toLowerCase() === 'pm';
        if (hour !== 12 && pm) hour += 12;
        if (hour === 12 && !pm) hour = 0;
      }
    }

    if (tomorrow.test(lower)) {
      date.setDate(date.getDate() + 1);
    } else if (dayMatch !== null) {
      const currentDay = date.getDay();
      let diff = dayMatch - currentDay;
      if (diff <= 0) diff += 7;
      date.setDate(date.getDate() + diff);
    }

    date.setHours(hour, minute, 0, 0);
    return date;
  },

  extractDuration(text) {
    if (!text || typeof text !== 'string') return 60;
    const m = text.match(/(\d+)\s*(?:minute|min|hr|hour|h)\s*/i);
    if (m) {
      const n = parseInt(m[1], 10);
      if (/hour|hr|h/i.test(text)) return Math.min(480, Math.max(1, n * 60));
      return Math.min(480, Math.max(1, n));
    }
    return 60;
  },

  extractLocation(text) {
    if (!text || typeof text !== 'string') return null;
    const at = text.match(/(?:at|in|@)\s+([^.?!]+?)(?:\s+(?:tomorrow|today|at\s+\d|$))/i);
    return at ? at[1].trim() : null;
  }
};

function normalizeDateTime(dateOrStr) {
  if (!dateOrStr) return null;
  const d = dateOrStr instanceof Date ? dateOrStr : new Date(dateOrStr);
  if (isNaN(d.getTime())) return null;
  return d.toISOString();
}

class NLPService {
  constructor(api) {
    this.api = api;
  }

  async parse(command) {
    const cmd = (command && String(command).trim()) || '';
    if (!cmd) return { intent_type: 'general', confidence: 0, entities: {} };

    try {
      if (this.api && typeof this.api.request === 'function') {
        const res = await this.api.request(APIConfig.ENDPOINTS.VOICE_COMMAND, {
          method: 'POST',
          body: JSON.stringify({ command: cmd })
        });
        const intent = res.intent || res;
        if (intent && intent.entities) return this._normalizeIntent(intent, cmd);
        return intent;
      }
    } catch (e) {
      return this._fallbackParse(cmd);
    }
    return this._fallbackParse(cmd);
  }

  _normalizeIntent(intent, rawCommand) {
    const entities = intent.entities || {};
    let when = entities.when;
    if (when && typeof when === 'string' && !when.match(/^\d{4}-\d{2}-\d{2}/)) {
      const dt = EntityExtractor.extractDateTime(rawCommand);
      entities.when_iso = dt ? normalizeDateTime(dt) : null;
    }
    if (!entities.duration_minutes) entities.duration_minutes = EntityExtractor.extractDuration(rawCommand);
    if (!entities.title) entities.title = EntityExtractor.extractTitle(rawCommand);
    return { ...intent, entities };
  }

  _fallbackParse(command) {
    const title = EntityExtractor.extractTitle(command);
    const whenDate = EntityExtractor.extractDateTime(command);
    const duration = EntityExtractor.extractDuration(command);
    const location = EntityExtractor.extractLocation(command);
    const whenStr = whenDate ? whenDate.toLocaleString() : 'unspecified';
    const whenIso = whenDate ? normalizeDateTime(whenDate) : null;

    const calendarWords = ['schedule', 'meeting', 'appointment', 'event', 'calendar', 'book', 'create', 'add', 'set'];
    const isCalendar = calendarWords.some(w => command.toLowerCase().includes(w));

    return {
      intent_type: isCalendar ? 'create_event' : 'general',
      confidence: isCalendar ? 0.6 : 0.3,
      entities: {
        title,
        when: whenStr,
        when_iso: whenIso,
        duration_minutes: duration,
        location: location || undefined,
        description: command
      }
    };
  }
}

if (typeof window !== 'undefined') {
  window.EntityExtractor = EntityExtractor;
  window.normalizeDateTime = normalizeDateTime;
  window.NLPService = NLPService;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EntityExtractor, normalizeDateTime, NLPService };
}
