import { useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, writeBatch, getDoc } from 'firebase/firestore';
import { TimeRecord } from '../types';

export const useTimeRecords = () => {
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, 'timeRecords'),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      const fetchedRecords = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt || new Date().toISOString(),
        updatedAt: doc.data().updatedAt || new Date().toISOString()
      })) as TimeRecord[];

      setRecords(fetchedRecords);
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
    } finally {
      setLoading(false);
    }
  };

  const registerTime = async (type: 'entry' | 'lunchOut' | 'lunchReturn' | 'exit') => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const currentTime = now.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });

    const todayRecord = records.find(record => record.date === today);

    try {
      if (todayRecord && todayRecord.id) {
        const recordRef = doc(db, 'timeRecords', todayRecord.id);
        const updatedRecord = {
          ...todayRecord,
          [type]: currentTime,
          updatedAt: now.toISOString()
        };
        
        if (type === 'exit') {
          updatedRecord.total = calculateTotalHours(updatedRecord);
        }
        
        await updateDoc(recordRef, updatedRecord);
      } else {
        const newRecord = {
          userId: user.uid,
          date: today,
          entry: type === 'entry' ? currentTime : '',
          lunchOut: type === 'lunchOut' ? currentTime : '',
          lunchReturn: type === 'lunchReturn' ? currentTime : '',
          exit: type === 'exit' ? currentTime : '',
          total: '0h',
          createdAt: now.toISOString(),
          updatedAt: now.toISOString()
        };
        await addDoc(collection(db, 'timeRecords'), newRecord);
      }
      await fetchRecords();
    } catch (error) {
      console.error('Erro ao registrar ponto:', error);
      throw error;
    }
  };

  const updateRecord = async (id: string, data: Partial<Omit<TimeRecord, 'id'>>) => {
    if (!id) throw new Error('ID do registro não fornecido');
    
    const recordRef = doc(db, 'timeRecords', id);
    await updateDoc(recordRef, {
      ...data,
      updatedAt: new Date().toISOString()
    });
    await fetchRecords();
  };

  const deleteRecord = async (id: string) => {
    if (!id) throw new Error('ID do registro não fornecido');
    
    const recordRef = doc(db, 'timeRecords', id);
    await deleteDoc(recordRef);
    await fetchRecords();
  };

  const deleteAllRecords = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const q = query(
        collection(db, 'timeRecords'),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      const batch = writeBatch(db);
      
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      await fetchRecords();
    } catch (error) {
      console.error('Erro ao deletar registros:', error);
      throw error;
    }
  };

  const calculateTotalHours = (record: TimeRecord) => {
    if (!record.entry || !record.exit) return '0h 0min';
    
    const parseTime = (timeStr: string) => {
      const [hours, minutes, seconds] = timeStr.split(':').map(Number);
      return hours * 3600 + minutes * 60 + (seconds || 0);
    };

    const entrySeconds = parseTime(record.entry);
    const exitSeconds = parseTime(record.exit);
    let totalSeconds = exitSeconds - entrySeconds;

    if (record.lunchOut && record.lunchReturn) {
      const lunchOutSeconds = parseTime(record.lunchOut);
      const lunchReturnSeconds = parseTime(record.lunchReturn);
      totalSeconds -= (lunchReturnSeconds - lunchOutSeconds);
    }

    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    
    return `${hours}h ${minutes}min`;
  };

  const parseTimeToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + minutes;
  };

  const calculateDashboardStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = records.find(record => record.date === today);
    
    // Total de hoje
    const todayTotal = todayRecord?.total || '0h';
    
    // Total da semana
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekRecords = records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= weekStart;
    });
    
    const weekMinutes = weekRecords.reduce((total, record) => {
      if (!record.total) return total;
      const [hours, minutes] = record.total.split('h ');
      return total + (parseInt(hours) * 60) + (parseInt(minutes) || 0);
    }, 0);
    
    const weekTotal = `${Math.floor(weekMinutes/60)}h ${weekMinutes%60}min`;
    
    // Get user settings for work hours
    const userSettings = await getDoc(doc(db, 'workSchedules', auth.currentUser!.uid));
    const workSchedule = userSettings.data()?.expectedDailyHours || '08:48'; // default to 8h48
    const dailyMinutes = parseTimeToMinutes(workSchedule);
    
    // Banco de horas (usando configuração do usuário)
    const workDays = records.length;
    const expectedMinutes = workDays * dailyMinutes;
    
    const totalMinutesWorked = records.reduce((total, record) => {
      if (!record.total) return total;
      const [hours, minutes] = record.total.split('h ');
      return total + (parseInt(hours) * 60) + (parseInt(minutes) || 0);
    }, 0);
    
    const balanceMinutes = totalMinutesWorked - expectedMinutes;
    const hoursBalance = `${Math.floor(Math.abs(balanceMinutes)/60)}h ${Math.abs(balanceMinutes)%60}min`;
    
    return {
      todayTotal,
      weekTotal,
      hoursBalance: balanceMinutes >= 0 ? `+${hoursBalance}` : `-${hoursBalance}`,
      workDays
    };
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return {
    records,
    loading,
    registerTime,
    updateRecord,
    deleteRecord,
    deleteAllRecords,
    calculateDashboardStats,
    calculateTotalHours,
    fetchRecords
  };
};