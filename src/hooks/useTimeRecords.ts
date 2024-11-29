import { useState, useEffect, useCallback } from 'react';
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
  writeBatch
} from 'firebase/firestore';
import { TimeRecord, TimeRecordType, NewTimeRecord, WorkSchedule, DashboardStats, GraphData, WeekDataPoint, MonthlyDataPoint, TimeDistribution } from '../types';
import { useWorkSchedule } from './useWorkSchedule';

export function useTimeRecords(userId: string) {
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { schedule } = useWorkSchedule();

  useEffect(() => {
    if (!userId) return;

    setLoading(true);
    const q = query(
      collection(db, 'timeRecords'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newRecords = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as TimeRecord[];
      
      setRecords(newRecords);
      setLoading(false);
    }, (error) => {
      console.error('Erro ao buscar registros:', error);
      setError(error.message);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  const calculateDashboardStats = useCallback(() => {
    return {
      todayTotal: '0h',
      weekTotal: '0h',
      hoursBalance: '0h'
    };
  }, [records]);

  const calculateGraphData = (): GraphData => {
    const emptyTimeDistribution: TimeDistribution = {
      morning: 0,
      afternoon: 0,
      overtime: 0
    };

    return {
      weekData: [],
      monthlyData: [],
      timeDistribution: emptyTimeDistribution
    };
  };

  const addRecord = async (record: NewTimeRecord) => {
    try {
      await addDoc(collection(db, 'timeRecords'), record);
    } catch (error) {
      console.error('Erro ao adicionar registro:', error);
      throw error;
    }
  };

  const updateRecord = async (id: string, updates: Partial<TimeRecord>) => {
    try {
      await updateDoc(doc(db, 'timeRecords', id), updates);
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
      const batch = writeBatch(db);
      records.forEach(record => {
        batch.delete(doc(db, 'timeRecords', record.id));
      });
      await batch.commit();
    } catch (error) {
      console.error('Erro ao limpar registros:', error);
      throw error;
    }
  };

  const registerTime = async (type: TimeRecordType) => {
    const calculateWorkHours = (
      entry: string,
      exit: string,
      lunchOut?: string,
      lunchReturn?: string,
      date: string = new Date().toISOString().split('T')[0]
    ) => {
      const entryTime = new Date(`${date}T${entry}`);
      const exitTime = new Date(`${date}T${exit}`);
      let totalHours = 0;

      if (lunchOut && lunchReturn) {
        const lunchOutTime = new Date(`${date}T${lunchOut}`);
        const lunchReturnTime = new Date(`${date}T${lunchReturn}`);
        
        const morningHours = (lunchOutTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60);
        const afternoonHours = (exitTime.getTime() - lunchReturnTime.getTime()) / (1000 * 60 * 60);
        
        totalHours = morningHours + afternoonHours;
      } else {
        totalHours = (exitTime.getTime() - entryTime.getTime()) / (1000 * 60 * 60);
      }

      const defaultWorkHours = 8;
      const workdayHours = (schedule as any)?.workHours ?? defaultWorkHours;
      const balance = totalHours - workdayHours;

      return {
        total: Number(totalHours.toFixed(2)),
        balance: Number(balance.toFixed(2)),
        morningHours: lunchOut ? 
          Number(((new Date(`${date}T${lunchOut}`).getTime() - entryTime.getTime()) / (1000 * 60 * 60)).toFixed(2)) 
          : 0,
        afternoonHours: (lunchReturn && exit) ? 
          Number(((exitTime.getTime() - new Date(`${date}T${lunchReturn}`).getTime()) / (1000 * 60 * 60)).toFixed(2)) 
          : 0,
        workdayHours
      };
    };

    try {
      // ... resto do código do registerTime ...
    } catch (error) {
      console.error('Erro ao registrar ponto:', error);
      throw error;
    }
  };

  return {
    records,
    loading,
    error,
    registerTime,
    calculateDashboardStats,
    calculateGraphData,
    addRecord,
    updateRecord,
    deleteRecord,
    clearRecords
  };
}