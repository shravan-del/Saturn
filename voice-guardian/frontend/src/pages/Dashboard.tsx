import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { VoiceButton } from '../components/VoiceButton';
import { ActionList } from '../components/ActionList';

export function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleActionCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb' }}>
      {/* Header */}
      <header style={{
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '1rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem' }}>🎙️ Voice Guardian</h1>
          <p style={{ margin: '0.25rem 0 0 0', color: '#6b7280', fontSize: '0.9rem' }}>
            Welcome, {user?.name}
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            background: '#ef4444',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </header>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 2fr',
          gap: '2rem',
          alignItems: 'start'
        }}>
          {/* Voice Control */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '2rem',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            position: 'sticky',
            top: '2rem'
          }}>
            <h2 style={{ textAlign: 'center', marginTop: 0 }}>Voice Command</h2>
            <VoiceButton onActionCreated={handleActionCreated} />
            
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: '#f0f9ff',
              borderRadius: '8px',
              fontSize: '0.9rem'
            }}>
              <strong>💡 Try saying:</strong>
              <ul style={{ margin: '0.5rem 0', paddingLeft: '1.5rem' }}>
                <li>"Schedule team standup for tomorrow at 9am"</li>
                <li>"Create a meeting on Friday at 2pm"</li>
                <li>"Book 30 minutes for code review this afternoon"</li>
              </ul>
            </div>

            <div style={{
              marginTop: '1rem',
              padding: '1rem',
              background: '#fff7ed',
              borderRadius: '8px',
              fontSize: '0.85rem'
            }}>
              <strong>⚙️ Setup Required:</strong>
              <p style={{ margin: '0.5rem 0 0 0' }}>
                Make sure you've connected Google Calendar in settings (coming soon)
              </p>
            </div>
          </div>

          {/* Actions List */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            minHeight: '400px'
          }}>
            <ActionList refresh={refreshKey} />
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  );
}


