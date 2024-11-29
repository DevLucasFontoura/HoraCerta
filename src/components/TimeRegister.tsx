import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { registerTimeEntry } from '../services/timesheet';
import styled from 'styled-components';

type TimeEntryType = 'entry' | 'exit' | 'lunch_exit' | 'lunch_return';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  background-color: #10B981;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex: 1;
  min-width: 150px;

  &:hover {
    background-color: #059669;
  }

  &:disabled {
    background-color: #9CA3AF;
    cursor: not-allowed;
  }

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const ErrorMessage = styled.div`
  color: #DC2626;
  background-color: #FEE2E2;
  padding: 0.75rem;
  border-radius: 4px;
  text-align: center;
  margin-top: 1rem;
`;

const TimeRegister = () => {
  const { currentUser } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (type: TimeEntryType) => {
    if (!currentUser) {
      setError('Usuário não autenticado');
      return;
    }

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

  return (
    <Container>
      <ButtonGroup>
        <Button 
          onClick={() => handleRegister('entry')} 
          disabled={loading}
        >
          Entrada
        </Button>
        <Button 
          onClick={() => handleRegister('lunch_exit')} 
          disabled={loading}
        >
          Saída Almoço
        </Button>
        <Button 
          onClick={() => handleRegister('lunch_return')} 
          disabled={loading}
        >
          Retorno Almoço
        </Button>
        <Button 
          onClick={() => handleRegister('exit')} 
          disabled={loading}
        >
          Saída
        </Button>
      </ButtonGroup>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Container>
  );
};

export default TimeRegister; 