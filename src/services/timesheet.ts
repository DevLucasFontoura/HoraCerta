import { db } from '../config/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  addDoc, 
  serverTimestamp, 
  Timestamp,
  onSnapshot,
  orderBy,
  deleteDoc,
  doc
} from 'firebase/firestore';

const TEMP_COLLECTION = 'dailyTimeEntries';
const HISTORY_COLLECTION = 'timeHistory';

export function subscribeToTodayEntries(userId: string, callback: (entries: any[]) => void) {
  if (!userId) {
    console.error('UserId não fornecido');
    return () => {};
  }

  console.log('Iniciando subscription para', userId);
  
  const q = query(
    collection(db, TEMP_COLLECTION),
    where('userId', '==', userId)
  );

  return onSnapshot(
    q, 
    (snapshot) => {
      console.log('Snapshot recebido:', snapshot.size, 'documentos');
      const entries = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      }))
      .sort((a, b) => a.timestamp - b.timestamp);
      
      callback(entries);
    },
    (error) => {
      console.error('Erro na subscription:', error);
    }
  );
}

export async function registerTimeEntry(userId: string, type: 'entry' | 'lunch_exit' | 'lunch_return' | 'exit') {
  if (!userId) {
    throw new Error('Usuário não autenticado');
  }

  console.log('Registrando entrada:', { userId, type });
  
  try {
    const docRef = await addDoc(collection(db, TEMP_COLLECTION), {
      userId,
      type,
      timestamp: serverTimestamp()
    });

    console.log('Entrada registrada com sucesso:', docRef.id);
    return docRef;
  } catch (error) {
    console.error('Erro ao registrar entrada:', error);
    throw error;
  }
}

async function consolidateDayRecords(userId: string) {
  console.log('Consolidando registros para:', userId);
  
  try {
    const entriesSnapshot = await getDocs(
      query(
        collection(db, TEMP_COLLECTION),
        where('userId', '==', userId),
        orderBy('timestamp', 'asc')
      )
    );

    console.log('Registros encontrados:', entriesSnapshot.size);

    const records = entriesSnapshot.docs.map(doc => ({
      type: doc.data().type,
      timestamp: doc.data().timestamp
    }));

    console.log('Registros processados:', records);

    // Salva no histórico
    const historyRef = await addDoc(collection(db, HISTORY_COLLECTION), {
      userId,
      date: new Date().toISOString().split('T')[0],
      records,
      createdAt: serverTimestamp()
    });

    console.log('Histórico salvo:', historyRef.id);

    // Remove registros temporários
    const deletePromises = entriesSnapshot.docs.map(doc => {
      console.log('Removendo documento:', doc.id);
      return deleteDoc(doc.ref);
    });
    
    await Promise.all(deletePromises);
    console.log('Registros temporários removidos com sucesso');
  } catch (error) {
    console.error('Erro na consolidação:', error);
    throw error;
  }
}

export async function checkTodayEntries(userId: string) {
  console.log('Verificando registros do dia para:', userId);
  
  try {
    const snapshot = await getDocs(
      query(
        collection(db, TEMP_COLLECTION),
        where('userId', '==', userId)
      )
    );

    console.log('Registros encontrados:', snapshot.size);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp?.toDate()
    }));
  } catch (error) {
    console.error('Erro ao verificar registros:', error);
    throw error;
  }
}

// Inicializa as coleções se não existirem
export async function initializeCollections() {
  try {
    // Cria um documento inicial em cada coleção
    await addDoc(collection(db, 'dailyTimeEntries'), {
      userId: 'system',
      type: 'system',
      timestamp: serverTimestamp()
    });

    await addDoc(collection(db, 'timeRecords'), {
      userId: 'system',
      type: 'system',
      timestamp: serverTimestamp()
    });

    console.log('Coleções inicializadas com sucesso');
  } catch (error) {
    console.error('Erro ao inicializar coleções:', error);
  }
}

// Chama a função quando o app iniciar
initializeCollections(); 