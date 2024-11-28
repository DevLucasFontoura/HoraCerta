import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { registerTimeEntry, subscribeToTodayEntries } from '../services/timesheet';

export function TimeRegister() {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    console.log('TimeRegister - currentUser:', currentUser?.uid);
    
    if (!currentUser) return;

    console.log('Configurando subscription...');
    
    const unsubscribe = subscribeToTodayEntries(currentUser.uid, (newEntries) => {
      console.log('Novos registros recebidos:', newEntries);
      setEntries(newEntries);
    });

    return () => {
      console.log('Limpando subscription...');
      unsubscribe();
    };
  }, [currentUser]);

  const handleRegister = async (type: 'entry' | 'lunch_exit' | 'lunch_return' | 'exit') => {
    try {
      setLoading(true);
      setError('');
      
      await registerTimeEntry(currentUser.uid, type);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getNextAction = () => {
    const types = entries.map(e => e.type);
    if (types.length === 0) return 'entry';
    if (types.length === 1) return 'lunch_exit';
    if (types.length === 2) return 'lunch_return';
    if (types.length === 3) return 'exit';
    return null;
  };

  const nextAction = getNextAction();

  return (
    <div>
      {error && <div className="error">{error}</div>}
      
      <div>
        <h3>Registros de Hoje ({entries.length})</h3>
        {entries.map(entry => (
          <div key={entry.id}>
            {entry.type}: {entry.timestamp?.toLocaleTimeString()}
          </div>
        ))}
      </div>

      {nextAction && (
        <button 
          onClick={() => handleRegister(nextAction)}
          disabled={loading}
        >
          {loading ? 'Registrando...' : `Registrar ${nextAction}`}
        </button>
      )}

      <pre style={{ fontSize: '12px', marginTop: '20px' }}>
        Debug: {JSON.stringify({ entries, loading, error }, null, 2)}
      </pre>
    </div>
  );
} 