import React, { useState } from 'react';
import { CATEGORIES, Category } from '../types';
import { Plus, Tag } from 'lucide-react';

interface ItemFormProps {
  onAddItem: (item: { name: string; qty: string; price: number; category: Category }) => void;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
}

const CATEGORY_EMOJIS: Record<Category, string> = {
  "Hortifruti": "🥦 Hortifruti",
  "Açougue e Peixaria": "🥩 Açougue e Peixaria",
  "Padaria": "🥖 Padaria",
  "Laticínios e Frios": "🧀 Laticínios e Frios",
  "Mercearia": "🥫 Mercearia",
  "Bebidas": "🍷 Bebidas",
  "Limpeza": "🧼 Limpeza",
  "Higiene e Beleza": "🧴 Higiene e Beleza",
  "Outros": "📦 Outros"
};

export default function ItemForm({ onAddItem, selectedCategory, setSelectedCategory }: ItemFormProps) {
  const [name, setName] = useState('');
  const [qty, setQty] = useState('');
  const [priceStr, setPriceStr] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) return;

    // Converte o preço estimado
    let cleanPrice = 0;
    if (priceStr.trim()) {
      const sanitized = priceStr.replace(/[^\d,.-]/g, '').replace(/\.(?=\d{3},)/g, '').replace(',', '.');
      const parsed = parseFloat(sanitized);
      if (!isNaN(parsed)) {
        cleanPrice = parsed;
      }
    }

    onAddItem({
      name: trimmedName,
      qty: qty.trim(),
      price: cleanPrice,
      category: selectedCategory,
    });

    setName('');
    setQty('');
    setPriceStr('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-line rounded-2xl p-5 shadow-md space-y-4 relative overflow-hidden" id="item-add-form">
      {/* Visual Accent Corner Ribbon */}
      <div className="absolute top-0 right-0 w-24 h-24 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10px] right-[-45px] w-[110px] h-6 bg-sage/10 rotate-45 border-b border-sage/10"></div>
      </div>

      <div className="flex gap-2.5">
        <input
          id="item-name-input"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Adicionar item... ex: Tomate"
          maxLength={60}
          className="flex-1 min-w-0 border-1.5 border-line rounded-xl px-4 py-3 text-[15px] font-sans bg-paper/50 text-ink placeholder-ink-soft/40 focus:outline-none focus:border-sage focus:bg-card focus:ring-4 focus:ring-sage/10 transition-all duration-200"
        />
        <button
          id="item-add-submit"
          type="submit"
          disabled={!name.trim()}
          className="flex-shrink-0 w-12 h-12 border-none rounded-xl bg-tomato text-white flex items-center justify-center font-bold text-xl cursor-pointer transition-all duration-200 hover:bg-tomato-dark active:scale-95 disabled:bg-line disabled:text-ink-soft/30 disabled:cursor-not-allowed shadow-sm hover:shadow-md"
          aria-label="Adicionar item"
        >
          <Plus size={22} strokeWidth={2.5} />
        </button>
      </div>

      <div className="flex gap-3">
        <div className="flex-1 min-w-0 relative">
          <input
            id="item-qty-input"
            type="text"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            placeholder="Qtd. (ex: 2un, 1kg)"
            className="w-full border-1.5 border-line rounded-xl px-3 py-2.5 text-xs font-mono bg-paper/50 text-ink placeholder-ink-soft/40 focus:outline-none focus:border-sage focus:bg-card focus:ring-4 focus:ring-sage/10 transition-all duration-200"
          />
        </div>
        <div className="flex-[1.3] min-w-0 relative">
          <input
            id="item-price-input"
            type="text"
            value={priceStr}
            onChange={(e) => setPriceStr(e.target.value)}
            placeholder="R$ preço estimado"
            className="w-full border-1.5 border-line rounded-xl px-3 py-2.5 text-xs font-mono bg-paper/50 text-ink placeholder-ink-soft/40 focus:outline-none focus:border-sage focus:bg-card focus:ring-4 focus:ring-sage/10 transition-all duration-200"
          />
        </div>
      </div>

      <div className="space-y-2 pt-1" id="category-selector">
        <span className="text-[10px] font-mono font-bold text-sage uppercase tracking-wider flex items-center gap-1.5 px-0.5">
          <Tag size={10} /> Categoria selecionada
        </span>
        <div className="flex flex-wrap gap-2 pt-0.5 max-h-[140px] overflow-y-auto pr-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              id={`chip-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`font-mono text-[11px] font-medium px-3 py-2 rounded-xl border-1.5 cursor-pointer whitespace-nowrap transition-all duration-200 ${
                cat === selectedCategory
                  ? 'bg-ink border-ink text-white shadow-md scale-[1.03]'
                  : 'bg-paper/70 border-line text-ink-soft hover:bg-paper-alt hover:text-ink hover:border-ink-soft/50'
              }`}
            >
              {CATEGORY_EMOJIS[cat]}
            </button>
          ))}
        </div>
      </div>
    </form>
  );
}
