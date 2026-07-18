import { initializeApp } from 'firebase/app';
import { 
  getFirestore, 
  collection, 
  doc, 
  onSnapshot, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  query, 
  where, 
  orderBy,
  writeBatch,
  getDocs
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Inicializa o Firebase com as credenciais do applet
const firebaseApp = initializeApp({
  apiKey: firebaseConfig.apiKey,
  authDomain: firebaseConfig.authDomain,
  projectId: firebaseConfig.projectId,
  storageBucket: firebaseConfig.storageBucket,
  messagingSenderId: firebaseConfig.messagingSenderId,
  appId: firebaseConfig.appId
});

// Inicializa o Firestore usando o ID do banco de dados específico do applet
export const db = getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId);

export interface ShoppingItem {
  id: string;
  name: string;
  qty?: string;
  price?: number;
  category: string;
  checked: boolean;
  addedAt: number;
  listId: string;
}

const ITEMS_COLLECTION = 'items';

/**
 * Escuta em tempo real as mudanças na lista de compras de um ID específico.
 */
export function subscribeToItems(listId: string, callback: (items: ShoppingItem[]) => void) {
  const q = query(
    collection(db, ITEMS_COLLECTION),
    where('listId', '==', listId)
  );

  return onSnapshot(q, (snapshot) => {
    const items: ShoppingItem[] = [];
    snapshot.forEach((doc) => {
      items.push({ id: doc.id, ...doc.data() } as ShoppingItem);
    });
    // Ordena por data de adição de forma decrescente no cliente
    items.sort((a, b) => b.addedAt - a.addedAt);
    callback(items);
  }, (error) => {
    console.error("Erro ao escutar mudanças no Firestore:", error);
  });
}

/**
 * Adiciona um item ao Firestore.
 */
export async function addFirebaseItem(item: Omit<ShoppingItem, 'id'>): Promise<string> {
  const itemDocRef = doc(collection(db, ITEMS_COLLECTION));
  await setDoc(itemDocRef, {
    ...item,
    id: itemDocRef.id
  });
  return itemDocRef.id;
}

/**
 * Atualiza o status 'checked' de um item.
 */
export async function toggleFirebaseItemChecked(id: string, checked: boolean) {
  const itemDocRef = doc(db, ITEMS_COLLECTION, id);
  await updateDoc(itemDocRef, { checked });
}

/**
 * Atualiza o preço estimado de um item.
 */
export async function updateFirebaseItemPrice(id: string, price: number) {
  const itemDocRef = doc(db, ITEMS_COLLECTION, id);
  await updateDoc(itemDocRef, { price: price || null });
}

/**
 * Remove um item do Firestore.
 */
export async function deleteFirebaseItem(id: string) {
  const itemDocRef = doc(db, ITEMS_COLLECTION, id);
  await deleteDoc(itemDocRef);
}

/**
 * Remove todos os itens marcados como comprados de uma lista específica.
 */
export async function clearFirebaseCart(listId: string) {
  const q = query(
    collection(db, ITEMS_COLLECTION),
    where('listId', '==', listId)
  );
  
  const snapshot = await getDocs(q);
  const batch = writeBatch(db);
  
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data && data.checked === true) {
      batch.delete(doc.ref);
    }
  });
  
  await batch.commit();
}
