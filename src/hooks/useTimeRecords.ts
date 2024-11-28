import { useState, useEffect } from 'react';
import { db } from '../config/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { TimeRecord } from '../types';

interface GraphData {
  weekData: Array<{
    date: string;
    hours: number;
    balance: string;
  }>;
  timeDistribution: Array<{
    name: string;
    value: number;
  }>;
  monthlyData: Array<{
    month: string;
    total: number;
    average: number;
  }>;
}

export function useTimeRecords(userId: string) {
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    console.log('Iniciando busca de registros para:', userId);

    const q = query(
      collection(db, 'timeRecords'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const data = snapshot.docs.map(doc => {
          const docData = doc.data();
          
          // Garantir que temos uma data válida
          const date = docData.date || 
            (docData.timestamp instanceof Timestamp 
              ? docData.timestamp.toDate().toISOString().split('T')[0]
              : new Date().toISOString().split('T')[0]);

          const record = {
            id: doc.id,
            ...docData,
            date
          } as TimeRecord;

          console.log('Registro processado:', {
            id: record.id,
            date: record.date,
            entry: record.entry,
            lunchOut: record.lunchOut,
            lunchReturn: record.lunchReturn,
            exit: record.exit,
            type: record.type,
            hours: record.hours
          });

          return record;
        });

        console.log('Total de registros:', data.length);
        setRecords(data);
        setLoading(false);
      },
      (error) => {
        console.error('Erro ao buscar registros:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  const addRecord = async (data: Omit<TimeRecord, 'id'>) => {
    try {
      await addDoc(collection(db, 'timeRecords'), data);
    } catch (error) {
      console.error('Erro ao adicionar registro:', error);
      throw error;
    }
  };

  const updateRecord = async (id: string, data: Partial<TimeRecord>) => {
    try {
      await updateDoc(doc(db, 'timeRecords', id), data);
    } catch (error) {
      console.error('Erro ao atualizar registro:', error);
      throw error;
    }
  };

  const deleteRecord = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'timeRecords', id));
    } catch (error) {
      console.error('Erro ao deletar registro:', error);
      throw error;
    }
  };

  const clearRecords = async () => {
    try {
      const batch = records.map(record => deleteRecord(record.id));
      await Promise.all(batch);
    } catch (error) {
      console.error('Erro ao limpar registros:', error);
      throw error;
    }
  };

  const registerTime = async (type: string) => {
    try {
      const now = new Date();
      const timeStr = now.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      // Buscar registro do dia atual
      const today = now.toISOString().split('T')[0];
      const existingRecord = records.find(r => r.date === today);

      console.log('Registrando ponto:', {
        type,
        timeStr,
        today,
        existingRecord: existingRecord ? {
          id: existingRecord.id,
          date: existingRecord.date,
          entry: existingRecord.entry,
          lunchOut: existingRecord.lunchOut,
          lunchReturn: existingRecord.lunchReturn,
          exit: existingRecord.exit
        } : null
      });

      if (existingRecord) {
        // Validar sequência de registros
        if (type === 'lunchOut' && !existingRecord.entry) {
          throw new Error('É necessário registrar a entrada primeiro');
        }
        if (type === 'lunchReturn' && !existingRecord.lunchOut) {
          throw new Error('É necessário registrar a saída para almoço primeiro');
        }
        if (type === 'exit' && !existingRecord.lunchReturn) {
          throw new Error('É necessário registrar o retorno do almoço primeiro');
        }

        // Atualizar registro existente
        const updates: Partial<TimeRecord> = {
          [type]: timeStr,
          updatedAt: now.toISOString()
        };

        console.log('Atualizando registro:', { id: existingRecord.id, updates });
        await updateDoc(doc(db, 'timeRecords', existingRecord.id), updates);
      } else {
        // Criar novo registro
        const newRecord: Omit<TimeRecord, 'id'> = {
          userId,
          date: today,
          type: 'regular',
          hours: 0,
          entry: type === 'entry' ? timeStr : undefined,
          lunchOut: type === 'lunchOut' ? timeStr : undefined,
          lunchReturn: type === 'lunchReturn' ? timeStr : undefined,
          exit: type === 'exit' ? timeStr : undefined,
          createdAt: now.toISOString(),
          updatedAt: now.toISOString(),
          displayDate: now.toLocaleDateString('pt-BR')
        };

        console.log('Criando novo registro:', newRecord);
        await addDoc(collection(db, 'timeRecords'), newRecord);
      }
    } catch (error) {
      console.error('Erro ao registrar ponto:', error);
      throw error;
    }
  };

  const calculateDashboardStats = () => {
    return {
      todayTotal: '0h',
      weekTotal: '0h',
      hoursBalance: '0h'
    };
  };

  const calculateGraphData = (): GraphData => {
    return {
      weekData: [],
      timeDistribution: [],
      monthlyData: []
    };
  };

  return {
    records,
    loading,
    error,
    addRecord,
    updateRecord,
    deleteRecord,
    clearRecords,
    registerTime,
    calculateDashboardStats,
    calculateGraphData
  };
}