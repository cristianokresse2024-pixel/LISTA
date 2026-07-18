import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ItemForm from './components/ItemForm';
import CategorySection from './components/CategorySection';
import ReceiptFooter from './components/ReceiptFooter';
import ToastNotification from './components/ToastNotification';
import { ShoppingItem, Category, CATEGORIES } from './types';
import { Share2, Users, CheckCircle } from 'lucide-react';
import { 
  subscribeToItems, 
  addFirebaseItem, 
  toggleFirebaseItemChecked, 
  updateFirebaseItemPrice, 
  deleteFirebaseItem, 
  clearFirebaseCart 
} from './firebase';

const COLLAPSE_KEY = "shopping-list-collapsed";
const ACTIVE_LIST_ID_KEY = "active-shopping-list-id";

// Função para gerar um ID de lista curto e amigável
function generateShortListId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = 'lista-';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function App() {
  const [listId, setListId] = useState<string>('');
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<Category>("Mercearia");
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'to-buy' | 'in-cart'>('to-buy');

  // 1. Resolver o listId correto no carregamento inicial
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    let currentListId = params.get('listId');

    if (currentListId) {
      // Se veio via URL, salva no localStorage como a ativa
      localStorage.setItem(ACTIVE_LIST_ID_KEY, currentListId);
    } else {
      // Se não veio via URL, tenta ler do localStorage
      const savedListId = localStorage.getItem(ACTIVE_LIST_ID_KEY);
      if (savedListId) {
        currentListId = savedListId;
      } else {
        // Se não tem nada, gera um novo
        currentListId = generateShortListId();
        localStorage.setItem(ACTIVE_LIST_ID_KEY, currentListId);
      }
      
      // Atualiza a URL sem recarregar a página para incluir o listId
      const newUrl = `${window.location.origin}${window.location.pathname}?listId=${currentListId}`;
      window.history.replaceState({ path: newUrl }, '', newUrl);
    }

    setListId(currentListId);

    // Carrega estados de colapso salvos
    try {
      const savedCollapse = localStorage.getItem(COLLAPSE_KEY);
      if (savedCollapse) {
        setCollapsedSections(JSON.parse(savedCollapse));
      }
    } catch (e) {
      console.error("Erro ao carregar estado de colapso:", e);
    }
  }, []);

  // 2. Se inscrever em tempo real no Firestore ao ter o listId definido
  useEffect(() => {
    if (!listId) return;

    setIsLoaded(false);
    const unsubscribe = subscribeToItems(listId, (fetchedItems) => {
      setItems(fetchedItems);
      setIsLoaded(true);
    });

    return () => unsubscribe();
  }, [listId]);

  // Salva estados de colapso no localStorage sempre que forem alterados
  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(COLLAPSE_KEY, JSON.stringify(collapsedSections));
    } catch (e) {
      // Ignora erro não-crítico
    }
  }, [collapsedSections, isLoaded]);

  // Ações do Firestore de forma assíncrona com feedback imediato
  const handleAddItem = async (newItemData: { name: string; qty: string; price: number; category: Category }) => {
    if (!listId) return;
    try {
      await addFirebaseItem({
        name: newItemData.name,
        qty: newItemData.qty || undefined,
        price: newItemData.price || undefined,
        category: newItemData.category,
        checked: false,
        addedAt: Date.now(),
        listId: listId
      });
      setToastMessage(`"${newItemData.name}" adicionado com sucesso!`);
    } catch (e) {
      setToastMessage("Erro ao adicionar item.");
    }
  };

  const handleToggleChecked = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    try {
      await toggleFirebaseItemChecked(id, !item.checked);
    } catch (e) {
      setToastMessage("Erro ao atualizar item.");
    }
  };

  const handleDelete = async (id: string) => {
    const itemToDelete = items.find((i) => i.id === id);
    try {
      await deleteFirebaseItem(id);
      if (itemToDelete) {
        setToastMessage(`"${itemToDelete.name}" removido.`);
      }
    } catch (e) {
      setToastMessage("Erro ao remover item.");
    }
  };

  const handleUpdatePrice = async (id: string, price: number) => {
    try {
      await updateFirebaseItemPrice(id, price);
    } catch (e) {
      setToastMessage("Erro ao atualizar preço.");
    }
  };

  const handleToggleCollapse = (category: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleClearCart = async () => {
    if (window.confirm("Deseja realmente remover todos os itens comprados do carrinho?")) {
      try {
        await clearFirebaseCart(listId);
        setToastMessage("Carrinho esvaziado!");
      } catch (e) {
        setToastMessage("Erro ao esvaziar carrinho.");
      }
    }
  };

  // Copiar link de compartilhamento para o cônjuge
  const handleShareList = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}?listId=${listId}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setToastMessage("Link copiado! Envie para o seu cônjuge no WhatsApp. 👩‍❤️‍👨");
      })
      .catch(() => {
        setToastMessage("Copie a URL do navegador para compartilhar!");
      });
  };

  const activeItems = items.filter((item) => !item.checked);
  const checkedItems = items.filter((item) => item.checked);

  return (
    <div className="relative min-h-screen bg-paper text-ink selection:bg-sage/20 transition-all duration-300">
      {/* Background radial dotted texture */}
      <div 
        className="fixed inset-0 pointer-events-none z-0 opacity-40" 
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(30,51,41,0.06) 1px, transparent 1px)',
          backgroundSize: '14px 14px',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-[560px] mx-auto px-4 py-5 pb-28 font-sans">
        <Header />

        {/* Real-time Connection & Sharing Bar */}
        <div 
          id="realtime-share-bar" 
          className="bg-card border-2 border-sage/20 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-md relative overflow-hidden"
        >
          {/* Subtle elegant pattern background */}
          <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[radial-gradient(#1e3329_1px,transparent_1px)] [background-size:16px_16px]"></div>
          
          <div className="flex items-center gap-3 relative z-10">
            <div className="relative flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500"></span>
            </div>
            <div>
              <div className="font-serif font-bold text-sm text-ink flex items-center gap-1.5">
                <Users size={14} className="text-sage" /> Sincronizado com Cônjuge
              </div>
              <p className="text-[10px] text-ink-soft/80 font-mono mt-0.5 uppercase tracking-wider">
                ID da lista: <span className="font-bold text-sage">{listId}</span>
              </p>
            </div>
          </div>
          
          <button
            id="share-button"
            type="button"
            onClick={handleShareList}
            className="w-full sm:w-auto font-sans text-xs font-bold text-white bg-sage hover:bg-sage/90 active:scale-95 px-4.5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md hover:shadow-lg relative z-10"
          >
            <Share2 size={13} strokeWidth={2.5} />
            Copiar Link para Cônjuge
          </button>
        </div>

        <ItemForm
          onAddItem={handleAddItem}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />

        {/* Tab/Segment Control to separate views */}
        <div className="mt-5 flex bg-paper-alt p-1 rounded-2xl border border-line gap-1" id="list-tabs-navigation">
          <button
            id="tab-to-buy"
            type="button"
            onClick={() => setActiveTab('to-buy')}
            className={`flex-1 py-2.5 rounded-xl font-sans text-sm font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'to-buy'
                ? 'bg-card text-ink shadow-sm border border-line/30'
                : 'text-ink-soft hover:text-ink hover:bg-paper/30'
            }`}
          >
            Para Comprar
            <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${
              activeTab === 'to-buy' ? 'bg-sage-bg text-sage font-bold' : 'bg-paper text-ink-soft/70'
            }`}>
              {activeItems.length}
            </span>
          </button>
          <button
            id="tab-in-cart"
            type="button"
            onClick={() => setActiveTab('in-cart')}
            className={`flex-1 py-2.5 rounded-xl font-sans text-sm font-semibold transition-all duration-150 cursor-pointer flex items-center justify-center gap-2 ${
              activeTab === 'in-cart'
                ? 'bg-card text-ink shadow-sm border border-line/30'
                : 'text-ink-soft hover:text-ink hover:bg-paper/30'
            }`}
          >
            No Carrinho
            <span className={`font-mono text-xs px-2 py-0.5 rounded-full ${
              activeTab === 'in-cart' ? 'bg-sage-bg text-sage font-bold' : 'bg-paper text-ink-soft/70'
            }`}>
              {checkedItems.length}
            </span>
          </button>
        </div>

        <main className="mt-6" id="shopping-list-sections">
          {!isLoaded ? (
            <div className="text-center py-10 font-mono text-sm text-ink-soft animate-pulse">
              sincronizando em tempo real...
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-12 px-4 text-ink-soft bg-card border border-line rounded-2xl shadow-xs" id="empty-state">
              <div className="font-serif font-semibold text-lg text-ink mb-1">
                Sua lista está vazia
              </div>
              <p className="text-xs sm:text-sm">
                Adicione seu primeiro item acima para começar a planejar suas compras.
              </p>
            </div>
          ) : activeTab === 'to-buy' ? (
            /* Active items grouped by category */
            activeItems.length === 0 ? (
              <div className="text-center py-12 px-4 text-sage bg-sage-bg/30 border border-line rounded-2xl shadow-xs animate-fade-in" id="all-bought-celebration">
                <div className="font-serif font-semibold text-lg text-ink mb-1 flex items-center justify-center gap-2">
                  Tudo comprado! <CheckCircle size={18} className="text-sage" />
                </div>
                <p className="text-xs sm:text-sm text-ink-soft">
                  Todos os seus itens já estão no carrinho. Boas compras!
                </p>
              </div>
            ) : (
              CATEGORIES.map((cat) => {
                const categoryItems = activeItems.filter((item) => item.category === cat);
                return (
                  <CategorySection
                    key={cat}
                    category={cat}
                    items={categoryItems}
                    isCollapsed={!!collapsedSections[cat]}
                    onToggleCollapse={() => handleToggleCollapse(cat)}
                    onToggleChecked={handleToggleChecked}
                    onDelete={handleDelete}
                    onUpdatePrice={handleUpdatePrice}
                  />
                );
              })
            )
          ) : (
            /* Checked items list */
            checkedItems.length === 0 ? (
              <div className="text-center py-12 px-4 text-ink-soft bg-card border border-line rounded-2xl shadow-xs" id="empty-cart-state">
                <div className="font-serif font-semibold text-lg text-ink mb-1">
                  Carrinho vazio
                </div>
                <p className="text-xs sm:text-sm">
                  Marque os itens da lista para enviá-los para cá enquanto faz as compras.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-end px-0.5">
                  <button
                    id="btn-clear-cart"
                    type="button"
                    onClick={handleClearCart}
                    className="font-mono text-xs font-semibold text-tomato hover:text-tomato-dark bg-tomato/10 hover:bg-tomato/20 border-none px-3.5 py-2 rounded-xl transition-all cursor-pointer"
                  >
                    Limpar Carrinho
                  </button>
                </div>
                <CategorySection
                  category="No Carrinho / Comprados"
                  items={checkedItems}
                  isCollapsed={!!collapsedSections["No Carrinho / Comprados"]}
                  onToggleCollapse={() => handleToggleCollapse("No Carrinho / Comprados")}
                  onToggleChecked={handleToggleChecked}
                  onDelete={handleDelete}
                  onUpdatePrice={handleUpdatePrice}
                />
              </div>
            )
          )}
        </main>
      </div>

      <ReceiptFooter items={items} />

      <ToastNotification message={toastMessage} onClear={() => setToastMessage(null)} />
    </div>
  );
}


