import { db } from './firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';

export async function checkIfEntryExists(userId: string, date: Date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const q = query(
    collection(db, 'timeEntries'),
    where('userId', '==', userId),
    where('timestamp', '>=', Timestamp.fromDate(startOfDay)),
    where('timestamp', '<=', Timestamp.fromDate(endOfDay)),
    where('type', '==', 'entry')
  );

  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

export async function registerTimeEntry(userId: string, type: 'entry' | 'exit') {
  if (type === 'entry') {
    const entryExists = await checkIfEntryExists(userId, new Date());
    if (entryExists) {
      throw new Error('Já existe um registro de entrada para hoje');
    }
  }

  return addDoc(collection(db, 'timeEntries'), {
    userId,
    type,
    timestamp: serverTimestamp(),
    deviceInfo: {
      userAgent: navigator.userAgent,
      platform: navigator.platform
    }
  });
} 