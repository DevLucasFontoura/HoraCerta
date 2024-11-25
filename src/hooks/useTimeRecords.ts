import { useState, useEffect } from 'react';
import { db, auth } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, writeBatch } from 'firebase/firestore';
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
    const currentTime = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    const todayRecord = records.find(record => record.date === today);

    try {
      if (todayRecord && todayRecord.id) {
        const recordRef = doc(db, 'timeRecords', todayRecord.id);
        const updatedRecord = {
          ...todayRecord,
          [type]: currentTime,
          updatedAt: now.toISOString()
        };
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
    fetchRecords
  };
};