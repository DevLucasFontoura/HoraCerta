import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { WorkSchedule } from '../types/workSchedule';

const DEFAULT_SCHEDULE: WorkSchedule = {
  startTime: '09:00',
  endTime: '18:00',
  lunchStartTime: '12:00',
  lunchEndTime: '13:00',
  workDays: [1, 2, 3, 4, 5], // Monday to Friday
  expectedDailyHours: '08:48',
  breakTime: '01:00'
};

export const useWorkSchedule = () => {
  const [schedule, setSchedule] = useState<WorkSchedule>(DEFAULT_SCHEDULE);
  const [loading, setLoading] = useState(true);

  const fetchSchedule = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const scheduleRef = doc(db, 'workSchedules', user.uid);
      const scheduleDoc = await getDoc(scheduleRef);

      if (scheduleDoc.exists()) {
        setSchedule(scheduleDoc.data() as WorkSchedule);
      } else {
        await setDoc(scheduleRef, DEFAULT_SCHEDULE);
      }
    } catch (error) {
      console.error('Erro ao buscar configurações:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSchedule = async (newSchedule: Partial<WorkSchedule>) => {
    const user = auth.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    try {
      const scheduleRef = doc(db, 'workSchedules', user.uid);
      const updatedSchedule = { ...schedule, ...newSchedule };
      await setDoc(scheduleRef, updatedSchedule);
      setSchedule(updatedSchedule);
    } catch (error) {
      console.error('Erro ao atualizar configurações:', error);
      throw error;
    }
  };

  useEffect(() => {
    fetchSchedule();
  }, []);

  return { schedule, loading, updateSchedule };
};