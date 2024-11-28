import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { registerTimeEntry, checkIfEntryExists } from '../services/timesheet';

export function TimeRegister() {
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRegisterEntry = async () => {
    try {
      setLoading(true);
      setError('');
      
      await registerTimeEntry(currentUser.uid, 'entry');
      // Mostrar mensagem de sucesso
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && <div className="error">{error}</div>}
      <button 
        onClick={handleRegisterEntry}
        disabled={loading}
      >
        Registrar Entrada
      </button>
    </div>
  );
} 