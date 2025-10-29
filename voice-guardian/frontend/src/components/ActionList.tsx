import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Action } from '../types';
import { ActionCard } from './ActionCard';

const API_URL = import.meta.env.VITE_API_URL;

export function ActionList({ refresh }: { refresh: number }) {
  const [actions, setActions] = useState<Action[]>([]);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    loadActions();
  }, [refresh]);

  const loadActions = async () => {
    try {
      const response = await fetch(`${API_URL}/actions/`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setActions(data.actions);
    } catch (err) {
      console.error('Error loading actions:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;
  }

  if (actions.length === 0) {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '3rem',
        color: '#6b7280'
      }}>
        <p style={{ fontSize: '3rem', margin: 0 }}>🎙️</p>
        <p style={{ fontSize: '1.2rem', margin: '1rem 0' }}>No actions yet</p>
        <p>Try saying "Schedule a meeting for tomorrow at 2pm"</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '1rem' }}>
      <h2 style={{ marginBottom: '1rem' }}>Recent Actions</h2>
      {actions.map(action => (
        <ActionCard key={action.id} action={action} />
      ))}
    </div>
  );
}


