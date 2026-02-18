const C = typeof Constants !== 'undefined' ? Constants : {};
const G = (C.GUARDIAN || {});
const AUTO = G.AUTO != null ? G.AUTO : 0.19;
const CONFIRM = G.CONFIRM != null ? G.CONFIRM : 0.49;
const BLOCK = G.BLOCK != null ? G.BLOCK : 1.0;
const MIN_DUR = G.MIN_DURATION_MIN != null ? G.MIN_DURATION_MIN : 1;
const MAX_DUR = G.MAX_DURATION_MIN != null ? G.MAX_DURATION_MIN : 480;
const SHORT_MIN = G.SHORT_EVENT_MIN != null ? G.SHORT_EVENT_MIN : 15;
const LONG_MIN = G.LONG_EVENT_MIN != null ? G.LONG_EVENT_MIN : 240;

async function runLayer(ctx, layer) {
  if (typeof layer.run === 'function') return await layer.run(ctx);
  return ctx;
}

const SanityCheckLayer = {
  run(ctx) {
    const intent = ctx.intent || {};
    const entities = intent.entities || {};
    const blockers = ctx.blockers || [];

    if (intent.intent_type === 'create_event') {
      if (!entities.title || String(entities.title).trim() === '') blockers.push('Missing event title');
      if (!entities.when && !entities.when_iso) blockers.push('Missing date or time');
      const dur = parseInt(entities.duration_minutes, 10);
      if (isNaN(dur) || dur < MIN_DUR || dur > MAX_DUR) blockers.push('Duration must be between ' + MIN_DUR + ' and ' + MAX_DUR + ' minutes');
    }

    return { ...ctx, blockers };
  }
};

const ConflictDetectionLayer = {
  async run(ctx) {
    const conflicts = ctx.conflicts || [];
    if (typeof ctx.getConflicts === 'function') {
      const list = await ctx.getConflicts(ctx);
      return { ...ctx, conflicts: list };
    }
    return { ...ctx, conflicts };
  }
};

const PatternAnalysisLayer = {
  run(ctx) {
    const intent = ctx.intent || {};
    const entities = intent.entities || {};
    const patternWarnings = ctx.patternWarnings || [];
    const dur = parseInt(entities.duration_minutes, 10);

    if (!isNaN(dur)) {
      if (dur < SHORT_MIN) patternWarnings.push('Very short event (under ' + SHORT_MIN + ' minutes)');
      if (dur > LONG_MIN) patternWarnings.push('Long event (over ' + (LONG_MIN / 60) + ' hours)');
    }

    return { ...ctx, patternWarnings };
  }
};

const RiskScoringLayer = {
  run(ctx) {
    let risk = 0;
    const intent = ctx.intent || {};
    const confidence = parseFloat(intent.confidence);
    if (!isNaN(confidence)) {
      if (confidence < 0.4) risk += 0.5;
      else if (confidence < 0.7) risk += 0.2;
    }
    if ((ctx.blockers || []).length > 0) risk += 0.6;
    if ((ctx.conflicts || []).length > 0) risk += 0.25;
    if ((ctx.patternWarnings || []).length > 0) risk += 0.1;
    return { ...ctx, risk_score: Math.min(1, risk) };
  }
};

const ModeDecisionLayer = {
  run(ctx) {
    const score = ctx.risk_score != null ? ctx.risk_score : 0;
    let mode = 'block';
    if (score < AUTO) mode = 'auto';
    else if (score < CONFIRM) mode = 'confirm';
    return { ...ctx, mode };
  }
};

const WarningGenerationLayer = {
  run(ctx) {
    const warnings = [];
    if ((ctx.blockers || []).length) warnings.push('This action has validation issues.');
    if ((ctx.conflicts || []).length) warnings.push('Possible calendar conflict.');
    if ((ctx.patternWarnings || []).length) warnings.push(ctx.patternWarnings.join(' '));
    if (ctx.intent && (ctx.intent.confidence || 1) < 0.7) warnings.push('Low confidence. Please confirm.');
    return { ...ctx, warnings };
  }
};

const RecommendationLayer = {
  run(ctx) {
    const intent = ctx.intent || {};
    const entities = intent.entities || {};
    let preview = '';

    if (intent.intent_type === 'create_event') {
      const title = entities.title || 'Untitled';
      const when = entities.when || 'unspecified time';
      const dur = entities.duration_minutes || 60;
      preview = "Create " + dur + "-minute event \"" + title + "\" at " + when;
    } else {
      preview = "Action: " + (intent.intent_type || 'general');
    }

    return { ...ctx, preview };
  }
};

const LAYERS = [
  SanityCheckLayer,
  ConflictDetectionLayer,
  PatternAnalysisLayer,
  RiskScoringLayer,
  ModeDecisionLayer,
  WarningGenerationLayer,
  RecommendationLayer
];

class Guardian {
  constructor() {
    this.riskThresholds = { auto: AUTO, confirm: CONFIRM, block: BLOCK };
  }

  async validate(intent, options) {
    let ctx = {
      intent,
      blockers: [],
      conflicts: [],
      patternWarnings: [],
      risk_score: 0,
      mode: 'confirm',
      warnings: [],
      preview: ''
    };
    if (options && typeof options.getConflicts === 'function') ctx.getConflicts = options.getConflicts;

    for (let i = 0; i < LAYERS.length; i++) {
      const layer = LAYERS[i];
      ctx = await runLayer(ctx, layer);
    }

    return {
      mode: ctx.mode,
      risk_score: ctx.risk_score,
      warnings: ctx.warnings || [],
      blockers: ctx.blockers || [],
      preview: ctx.preview
    };
  }
}

if (typeof window !== 'undefined') window.Guardian = Guardian;
if (typeof module !== 'undefined' && module.exports) module.exports = Guardian;
