import { Action } from '../types';

export function ActionCard({ action }: { action: Action }) {
  const statusColors = {
    pending: '#fbbf24',
    completed: '#10b981',
    failed: '#ef4444',
    cancelled: '#6b7280'
  };

  const statusEmoji = {
    pending: '⏳',
    completed: '✅',
    failed: '❌',
    cancelled: '🚫'
  };

  return (
    <div style={{
      padding: '1rem',
      background: 'white',
      border: '1px solid #e5e7eb',
      borderRadius: '8px',
      marginBottom: '1rem'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'start',
        marginBottom: '0.5rem'
      }}>
        <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{action.title}</h3>
        <span style={{
          padding: '0.25rem 0.75rem',
          background: statusColors[action.status],
          color: 'white',
          borderRadius: '12px',
          fontSize: '0.85rem',
          fontWeight: 'bold'
        }}>
          {statusEmoji[action.status]} {action.status}
        </span>
      </div>

      <p style={{ 
        margin: '0.5rem 0', 
        color: '#6b7280',
        fontSize: '0.9rem',
        fontStyle: 'italic'
      }}>
        "{action.voice_command}"
      </p>

      {action.description && (
        <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
          {action.description}
        </p>
      )}

      <div style={{
        display: 'flex',
        gap: '1rem',
        marginTop: '0.75rem',
        fontSize: '0.85rem',
        color: '#6b7280'
      }}>
        <span>Confidence: {(action.confidence * 100).toFixed(0)}%</span>
        <span>Mode: {action.guardian_mode}</span>
        <span>{new Date(action.created_at).toLocaleString()}</span>
      </div>

      {action.external_url && (
        <a
          href={action.external_url}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            marginTop: '0.75rem',
            padding: '0.5rem 1rem',
            background: '#3b82f6',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '6px',
            fontSize: '0.9rem'
          }}
        >
          View in Calendar →
        </a>
      )}
    </div>
  );
}


