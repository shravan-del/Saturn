export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Action {
  id: string;
  intent_type: string;
  title: string;
  description?: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  confidence: number;
  guardian_mode: 'auto' | 'confirm' | 'block';
  voice_command: string;
  external_url?: string;
  created_at: string;
  completed_at?: string;
}

export interface GuardianResult {
  mode: 'auto' | 'confirm' | 'block';
  confidence: number;
  risk_score: number;
  warnings: Array<{ type: string; message: string }>;
  blockers: Array<{ type: string; message: string }>;
  preview: string;
}


