import { useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, writeBatch, getDoc } from 'firebase/firestore';
import { TimeRecord } from '../types';

export const useTimeRecords = () => {
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const formatTimeDisplay = (timeStr: string) => {
    if (!timeStr) return '';
    // Remove os segundos se existirem
    return timeStr.split(':').slice(0, 2).join(':');
  };

  const fetchRecords = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, 'timeRecords'),
        where('userId', '==', user.uid)
      );

      const querySnapshot = await getDocs(q);
      const fetchedRecords = querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          entry: data.entry ? formatTimeDisplay(data.entry) : '',
          lunchOut: data.lunchOut ? formatTimeDisplay(data.lunchOut) : '',
          lunchReturn: data.lunchReturn ? formatTimeDisplay(data.lunchReturn) : '',
          exit: data.exit ? formatTimeDisplay(data.exit) : '',
          createdAt: data.createdAt || new Date().toISOString(),
          updatedAt: data.updatedAt || new Date().toISOString()
        };
      }) as TimeRecord[];

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
    
    // Calcula o total se tivermos todos os horários necessários
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    };

    if (data.entry && data.exit) {
      const recordData = {
        ...data,
        id,
        userId: auth.currentUser!.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      } as TimeRecord;
      
      updatedData.total = calculateTotalHours(recordData);
    }

    await updateDoc(recordRef, updatedData);
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
      // Converte horário para minutos totais
      const [hours, minutes] = timeStr.split(':').map(Number);
      return (hours * 60) + minutes;
    };

    try {
      // Primeiro período: entrada até saída almoço
      const entryTime = parseTime(record.entry);
      const lunchOutTime = parseTime(record.lunchOut || '');
      
      // Segundo período: retorno do almoço até saída
      const lunchReturnTime = parseTime(record.lunchReturn || '');
      const exitTime = parseTime(record.exit);
      
      // Calcula os períodos
      const firstPeriod = lunchOutTime - entryTime;
      const secondPeriod = exitTime - lunchReturnTime;
      
      // Total em minutos
      const totalMinutes = firstPeriod + secondPeriod;
      
      // Converte para formato de exibição
      const hours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      
      console.log('Cálculo detalhado:', {
        entrada: record.entry,
        saidaAlmoco: record.lunchOut,
        retornoAlmoco: record.lunchReturn,
        saida: record.exit,
        primeiroPeriodo: firstPeriod,
        segundoPeriodo: secondPeriod,
        totalMinutos: totalMinutes,
        resultado: `${hours}h ${minutes}min`
      });
      
      return `${hours}h ${minutes}min`;
    } catch (error) {
      console.error('Erro no cálculo:', error);
      return '0h 0min';
    }
  };

  const parseTimeToMinutes = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return (hours * 60) + minutes;
  };

  const calculateDashboardStats = async () => {
    const today = new Date().toISOString().split('T')[0];
    const todayRecord = records.find(record => record.date === today);
    
    // Total de hoje
    const todayTotal = todayRecord?.total || '0h 0min';
    
    // Total da semana
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekRecords = records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= weekStart;
    });
    
    const weekMinutes = weekRecords.reduce((total, record) => {
      if (!record.total) return total;
      const [hours, minutesStr] = record.total.split('h ');
      const minutes = parseInt(minutesStr.replace('min', ''));
      return total + (parseInt(hours) * 60) + minutes;
    }, 0);
    
    const weekTotal = `${Math.floor(weekMinutes/60)}h ${weekMinutes%60}min`;
    
    // Get user settings for work hours
    const userSettings = await getDoc(doc(db, 'workSchedules', auth.currentUser!.uid));
    const workSchedule = userSettings.data()?.expectedDailyHours || '08:48';
    const dailyMinutes = parseTimeToMinutes(workSchedule);
    
    // Banco de horas
    const workDays = records.length;
    const expectedMinutes = workDays * dailyMinutes;
    
    const totalMinutesWorked = records.reduce((total, record) => {
      if (!record.total) return total;
      const [hours, minutesStr] = record.total.split('h ');
      const minutes = parseInt(minutesStr.replace('min', ''));
      return total + (parseInt(hours) * 60) + minutes;
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

  const calculateDailyBalance = (record: TimeRecord, expectedDailyHours: string) => {
    if (!record.total) return '0h 0min';
    
    try {
      // Converte o total trabalhado para minutos
      const [workedHours, workedMinStr] = record.total.split('h ');
      const workedMin = parseInt(workedMinStr.replace('min', ''));
      const totalWorkedMinutes = (parseInt(workedHours) * 60) + workedMin;
      
      // Converte a jornada esperada para minutos (8:48 = 528 minutos)
      const [expectedHours, expectedMinutes] = expectedDailyHours.split(':');
      const expectedTotalMinutes = (parseInt(expectedHours) * 60) + parseInt(expectedMinutes);
      
      // Calcula a diferença
      const diffMinutes = totalWorkedMinutes - expectedTotalMinutes;
      const hours = Math.floor(Math.abs(diffMinutes) / 60);
      const minutes = Math.abs(diffMinutes) % 60;
      
      console.log('Cálculo do saldo:', {
        totalTrabalhado: totalWorkedMinutes,
        jornadaEsperada: expectedTotalMinutes,
        diferenca: diffMinutes,
        resultado: diffMinutes >= 0 ? `+${hours}h ${minutes}min` : `-${hours}h ${minutes}min`
      });
      
      return diffMinutes >= 0 
        ? `+${hours}h ${minutes}min`
        : `-${hours}h ${minutes}min`;
    } catch (error) {
      console.error('Erro no cálculo do saldo:', error);
      return '0h 0min';
    }
  };

  const calculateGraphData = (expectedDailyHours: string) => {
    // Dados da semana
    const weekData = records.map(record => ({
      date: record.date,
      hours: record.total ? parseFloat(record.total.split('h')[0]) : 0,
      balance: record.total ? calculateDailyBalance(record, expectedDailyHours) : '0h 0min'
    }));

    // Distribuição de tempo
    const timeDistribution = records.reduce((acc, record) => {
      if (!record.total) return acc;
      
      const [hours] = record.total.split('h').map(Number);
      const balance = calculateDailyBalance(record, expectedDailyHours);
      const extraHours = balance.startsWith('+') ? parseFloat(balance.split('h')[0]) : 0;
      
      return {
        worked: acc.worked + hours,
        extra: acc.extra + extraHours,
        breaks: acc.breaks + (record.lunchOut && record.lunchReturn ? 1 : 0)
      };
    }, { worked: 0, extra: 0, breaks: 0 });

    return {
      weekData,
      timeDistribution: [
        { name: 'Tempo Trabalhado', value: timeDistribution.worked },
        { name: 'Horas Extras', value: timeDistribution.extra },
        { name: 'Pausas', value: timeDistribution.breaks }
      ],
      monthlyData: [] // implementar depois
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
    calculateTotalHours,
    calculateDashboardStats,
    calculateGraphData
  };
};