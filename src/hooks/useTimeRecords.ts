import { useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, writeBatch, getDoc, onSnapshot, orderBy } from 'firebase/firestore';
import { TimeRecord } from '../types';

const formatTimeDisplay = (timeStr: string) => {
  if (!timeStr) return '';
  return timeStr.split(':').slice(0, 2).join(':');
};

const formatDateDisplay = (dateStr: string) => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-');
  return `${day} / ${month} / ${year}`;
};

export const useTimeRecords = () => {
  const [records, setRecords] = useState<TimeRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecords = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, 'timeRecords'),
        where('userId', '==', user.uid),
        orderBy('date', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedRecords = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            displayDate: formatDateDisplay(data.date),
            date: data.date,
            entry: data.entry ? formatTimeDisplay(data.entry) : '',
            lunchOut: data.lunchOut ? formatTimeDisplay(data.lunchOut) : '',
            lunchReturn: data.lunchReturn ? formatTimeDisplay(data.lunchReturn) : '',
            exit: data.exit ? formatTimeDisplay(data.exit) : '',
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString()
          };
        }) as TimeRecord[];

        setRecords(fetchedRecords);
        setLoading(false);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error('Erro ao buscar registros:', error);
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
    
    // Total de hoje - só calcula se tiver registro completo
    const todayTotal = todayRecord?.total || '0h 0min';
    
    // Total da semana - considera apenas registros completos
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay());
    const weekRecords = records.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= weekStart && record.total; // Só considera registros com total calculado
    });
    
    const weekMinutes = weekRecords.reduce((total, record) => {
      if (!record.total) return total;
      
      // Tratamento seguro para registros sem total
      try {
        const [hours, minutesStr] = record.total.split('h ');
        const minutes = parseInt(minutesStr?.replace('min', '') || '0');
        return total + (parseInt(hours || '0') * 60) + (minutes || 0);
      } catch (error) {
        console.warn('Registro com formato inválido:', record);
        return total;
      }
    }, 0);
    
    const weekTotal = `${Math.floor(weekMinutes/60)}h ${weekMinutes%60}min`;
    
    // Get user settings for work hours
    const userSettings = await getDoc(doc(db, 'workSchedules', auth.currentUser!.uid));
    const workSchedule = userSettings.data()?.expectedDailyHours || '08:48';
    const dailyMinutes = parseTimeToMinutes(workSchedule);
    
    // Banco de horas - considera apenas registros completos
    const completedRecords = records.filter(record => record.total);
    const workDays = completedRecords.length;
    const expectedMinutes = workDays * dailyMinutes;
    
    const totalMinutesWorked = completedRecords.reduce((total, record) => {
      if (!record.total) return total;
      
      try {
        const [hours, minutesStr] = record.total.split('h ');
        const minutes = parseInt(minutesStr?.replace('min', '') || '0');
        return total + (parseInt(hours || '0') * 60) + (minutes || 0);
      } catch (error) {
        console.warn('Registro com formato inválido:', record);
        return total;
      }
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
      
      // console.log('Cálculo do saldo:', {
      //   totalTrabalhado: totalWorkedMinutes,
      //   jornadaEsperada: expectedTotalMinutes,
      //   diferenca: diffMinutes,
      //   resultado: diffMinutes >= 0 ? `+${hours}h ${minutes}min` : `-${hours}h ${minutes}min`
      // });
      
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

    // Calcula a distribuição de tempo
    const totalWorkedMinutes = records.reduce((total, record) => {
      if (!record.total) return total;
      const [hours, minutesStr] = record.total.split('h ');
      const minutes = parseInt(minutesStr.replace('min', ''));
      return total + (parseInt(hours) * 60) + minutes;
    }, 0);

    const expectedMinutes = records.length * parseTimeToMinutes(expectedDailyHours);
    const extraMinutes = Math.max(0, totalWorkedMinutes - expectedMinutes);
    const breaksMinutes = records.reduce((total, record) => {
      if (!record.lunchOut || !record.lunchReturn) return total;
      const lunchOutMinutes = parseTimeToMinutes(record.lunchOut);
      const lunchReturnMinutes = parseTimeToMinutes(record.lunchReturn);
      return total + (lunchReturnMinutes - lunchOutMinutes);
    }, 0);

    const timeDistribution = [
      { name: 'Tempo Trabalhado', value: totalWorkedMinutes - extraMinutes - breaksMinutes },
      { name: 'Horas Extras', value: extraMinutes },
      { name: 'Pausas', value: breaksMinutes }
    ];

    // Cálculo dos dados mensais
    const monthlyData = records.reduce((acc: { [key: string]: { total: number; count: number } }, record) => {
      const date = new Date(record.date);
      const monthKey = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      const [hours, minutes] = (record.total || '0h 0min')
        .replace('h ', ':')
        .replace('min', '')
        .split(':')
        .map(Number);
      
      const totalHours = hours + (minutes / 60);

      if (!acc[monthKey]) {
        acc[monthKey] = { total: 0, count: 0 };
      }
      
      acc[monthKey].total += totalHours;
      acc[monthKey].count += 1;
      
      return acc;
    }, {});

    const monthlyDataFormatted = Object.entries(monthlyData).map(([month, data]) => ({
      month,
      total: Number(data.total.toFixed(2)),
      average: Number((data.total / data.count).toFixed(2))
    }));

    monthlyDataFormatted.sort((a, b) => {
      const [monthA, yearA] = a.month.split('/').map(Number);
      const [monthB, yearB] = b.month.split('/').map(Number);
      return yearA !== yearB ? yearA - yearB : monthA - monthB;
    });

    return {
      weekData: weekData,
      timeDistribution: timeDistribution,
      monthlyData: monthlyDataFormatted
    };
  };

  const addTestData = async () => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    const testData = [
      {
        date: '2024-11-25',
        entry: '08:29',
        lunchOut: '11:45',
        lunchReturn: '10:45',
        exit: '18:50'
      },
      {
        date: '2024-11-26',
        entry: '08:29',
        lunchOut: '10:45',
        lunchReturn: '11:45',
        exit: '18:50'
      }
    ];

    try {
      const batch = writeBatch(db);
      
      for (const data of testData) {
        const newDoc = {
          userId: user.uid,
          ...data,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        const docRef = doc(collection(db, 'timeRecords'));
        batch.set(docRef, newDoc);
      }

      await batch.commit();
      await fetchRecords();
    } catch (error) {
      console.error('Erro ao adicionar dados de teste:', error);
      throw error;
    }
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
    calculateGraphData,
    addTestData
  };
};