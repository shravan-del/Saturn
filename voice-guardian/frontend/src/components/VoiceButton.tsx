import { useVoice } from '../hooks/useVoice';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';
import { GuardianResult } from '../types';

const API_URL = import.meta.env.VITE_API_URL;

export function VoiceButton({ onActionCreated }: { onActionCreated: () => void }) {
  const { isListening, transcript, error, startListening, stopListening, setTranscript } = useVoice();
  const { token } = useAuth();
  const [processing, setProcessing] = useState(false);
  const [guardianResult, setGuardianResult] = useState<GuardianResult | null>(null);
  const [actionId, setActionId] = useState<string | null>(null);

  const handleVoiceComplete = async () => {
    console.log('handleVoiceComplete called with transcript:', transcript);
    if (!transcript) {
      console.log('No transcript, returning');
      return;
    }

    setProcessing(true);
    try {
      console.log('Sending command:', transcript);
      console.log('Token:', token);
      
      const response = await fetch(`${API_URL}/voice/command`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ command: transcript })
      });

      const data = await response.json();
      setGuardianResult(data.guardian);
      setActionId(data.action_id);

      // If auto mode, execute immediately
      if (data.guardian.mode === 'auto') {
        await executeAction(data.action_id, true);
      }
    } catch (err) {
      console.error('Error processing command:', err);
    } finally {
      setProcessing(false);
    }
  };

  const executeAction = async (id: string, confirm: boolean) => {
    try {
      const response = await fetch(`${API_URL}/actions/execute`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action_id: id, confirm })
      });

      const data = await response.json();
      
      if (data.success) {
        alert(`✅ ${data.message}\n\nEvent created: ${data.event_url}`);
        onActionCreated();
        reset();
      }
    } catch (err) {
      console.error('Error executing action:', err);
      alert('Failed to execute action');
    }
  };

  const reset = () => {
    setTranscript('');
    setGuardianResult(null);
    setActionId(null);
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      gap: '1rem',
      padding: '2rem'
    }}>
      <button
        onClick={() => {
          console.log('Voice button clicked, isListening:', isListening);
          if (isListening) {
            stopListening();
          } else {
            startListening();
          }
        }}
        disabled={processing}
        style={{
          width: '120px',
          height: '120px',
          borderRadius: '50%',
          border: 'none',
          background: isListening ? '#ef4444' : processing ? '#9ca3af' : '#3b82f6',
          color: 'white',
          fontSize: '3rem',
          cursor: processing ? 'not-allowed' : 'pointer',
          boxShadow: isListening ? '0 0 30px rgba(239, 68, 68, 0.6)' : '0 4px 6px rgba(0,0,0,0.1)',
          transition: 'all 0.3s',
          animation: isListening ? 'pulse 1.5s infinite' : 'none'
        }}
      >
        {processing ? '⏳' : isListening ? '⏹' : '🎙️'}
      </button>

      {error && (
        <div style={{
          padding: '1rem',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '8px',
          color: '#c33'
        }}>
          {error}
        </div>
      )}

      {transcript && !guardianResult && (
        <div style={{
          padding: '1rem',
          background: '#f0f9ff',
          borderRadius: '8px',
          minWidth: '300px'
        }}>
          <strong>You said:</strong> {transcript}
          <button
            onClick={handleVoiceComplete}
            disabled={processing}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              width: '100%'
            }}
          >
            {processing ? 'Processing...' : 'Process Command'}
          </button>
        </div>
      )}

      {guardianResult && (
        <div style={{
          padding: '1.5rem',
          background: guardianResult.mode === 'block' ? '#fee' : '#fff7ed',
          border: `2px solid ${guardianResult.mode === 'block' ? '#fcc' : '#fed7aa'}`,
          borderRadius: '8px',
          minWidth: '400px',
          maxWidth: '500px'
        }}>
          <h3 style={{ margin: '0 0 1rem 0' }}>
            {guardianResult.mode === 'block' ? '🚫 Cannot Execute' : '⚠️ Confirm Action'}
          </h3>
          
          <p><strong>Preview:</strong> {guardianResult.preview}</p>
          <p><strong>Confidence:</strong> {(guardianResult.confidence * 100).toFixed(0)}%</p>

          {guardianResult.warnings.map((w, i) => (
            <div key={i} style={{ 
              padding: '0.5rem', 
              background: '#fef3c7', 
              borderRadius: '4px',
              marginTop: '0.5rem'
            }}>
              ⚠️ {w.message}
            </div>
          ))}

          {guardianResult.blockers.map((b, i) => (
            <div key={i} style={{ 
              padding: '0.5rem', 
              background: '#fee', 
              borderRadius: '4px',
              marginTop: '0.5rem'
            }}>
              ❌ {b.message}
            </div>
          ))}

          {guardianResult.mode !== 'block' && actionId && (
            <div style={{ 
              display: 'flex', 
              gap: '0.5rem', 
              marginTop: '1rem' 
            }}>
              <button
                onClick={() => executeAction(actionId, true)}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontWeight: 'bold'
                }}
              >
                ✓ Confirm
              </button>
              <button
                onClick={() => {
                  executeAction(actionId, false);
                  reset();
                }}
                style={{
                  flex: 1,
                  padding: '0.75rem',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                ✗ Cancel
              </button>
            </div>
          )}

          {guardianResult.mode === 'block' && (
            <button
              onClick={reset}
              style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                width: '100%'
              }}
            >
              Try Again
            </button>
          )}
        </div>
      )}
    </div>
  );
}
