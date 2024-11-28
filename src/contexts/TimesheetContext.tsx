import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

interface TimeEntry {
  id: string;
  type: 'entry' | 'lunch_exit' | 'lunch_return' | 'exit';
  timestamp: Date;
  userId: string;
}

interface TimesheetContextType {
  todayEntries: TimeEntry[];
  loading: boolean;
  error: string | null;
}

const TimesheetContext = createContext<TimesheetContextType>({
  todayEntries: [],
  loading: true,
  error: null
});

export function TimesheetProvider({ children }: { children: React.ReactNode }) {
  const [todayEntries, setTodayEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    console.log('TimesheetProvider - currentUser:', currentUser?.uid);
    
    if (!currentUser) {
      setLoading(false);
      return;
    }

    console.log('Iniciando listener de registros...');
    
    // Query simplificada
    const q = query(
      collection(db, 'dailyTimeEntries'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const entries = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp?.toDate()
        })) as TimeEntry[];
        
        // Ordenação no cliente
        entries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
        
        setTodayEntries(entries);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao buscar registros:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => {
      console.log('Limpando listener...');
      unsubscribe();
    };
  }, [currentUser]);

  return (
    <TimesheetContext.Provider value={{ todayEntries, loading, error }}>
      {children}
    </TimesheetContext.Provider>
  );
}

export const useTimesheet = () => useContext(TimesheetContext); 