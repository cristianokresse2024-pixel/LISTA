import React, { useState, useEffect } from 'react';
import { ShoppingItem } from '../types';
import { Trash2, Check } from 'lucide-react';
import { fmtMoney, parsePrice } from '../utils';

interface ItemRowProps {
  item: ShoppingItem;
  onToggleChecked: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdatePrice: (id: string, price: number) => void;
}

export default function ItemRow({ item, onToggleChecked, onDelete, onUpdatePrice }: ItemRowProps) {
  const [priceInput, setPriceInput] = useState(item.price ? fmtMoney(item.price) : '');

  // Sincroniza o input quando o item muda externamente
  useEffect(() => {
    setPriceInput(item.price ? fmtMoney(item.price) : '');
  }, [item.price]);

  const handleBlur = () => {
    const numericValue = parsePrice(priceInput);
    onUpdatePrice(item.id, numericValue);
    setPriceInput(numericValue > 0 ? fmtMoney(numericValue) : '');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.currentTarget.blur();
    }
  };

  return (
    <div
      id={`item-row-${item.id}`}
      className={`bg-card border border-line rounded-2xl p-4 flex items-center gap-3.5 shadow-sm transition-all duration-200 relative overflow-hidden ${
        item.checked 
          ? 'bg-paper-alt/40 border-line/50 opacity-60 scale-[0.98]' 
          : 'hover:scale-[1.01] hover:shadow-md hover:border-sage/40'
      }`}
    >
      {/* Decorative vertical category indicator on the left side of active cards */}
      {!item.checked && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-sage/30 rounded-r-md"></div>
      )}

      {/* Custom Checkbox */}
      <button
        id={`chk-${item.id}`}
        type="button"
        onClick={() => onToggleChecked(item.id)}
        className={`w-6.5 h-6.5 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all duration-200 ${
          item.checked
            ? 'bg-sage border-sage text-white shadow-sm'
            : 'bg-paper border-line hover:border-sage hover:bg-sage/5'
        }`}
        aria-label={item.checked ? "Desmarcar item" : "Marcar item"}
      >
        <Check
          size={14}
          strokeWidth={3}
          className={`transition-opacity duration-150 ${item.checked ? 'opacity-100' : 'opacity-0'}`}
        />
      </button>

      {/* Item Information */}
      <div className="flex-1 min-w-0" onClick={() => onToggleChecked(item.id)}>
        <div
          className={`text-[15px] font-semibold text-ink leading-snug cursor-pointer transition-all duration-150 ${
            item.checked ? 'line-through text-ink-soft/60 decoration-ink-soft/40' : ''
          }`}
        >
          {item.name}
        </div>
        {item.qty ? (
          <div className="font-mono text-[10.5px] text-ink-soft/80 mt-1 flex items-center gap-1.5" id={`qty-${item.id}`}>
            <span className="bg-paper-alt px-1.5 py-0.5 rounded text-[10px] font-bold border border-line/35">
              {item.qty}
            </span>
            {item.checked && (
              <span className="opacity-70 font-sans italic">
                · {item.category}
              </span>
            )}
          </div>
        ) : (
          item.checked && (
            <div className="font-sans text-[10.5px] text-ink-soft/70 mt-1 italic" id={`cat-${item.id}`}>
              {item.category}
            </div>
          )
        )}
      </div>

      {/* Editable price input styled as a vintage boutique price tag */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="relative flex items-center border border-line/50 rounded-xl bg-paper/40 px-2 py-1 hover:border-sage/40 focus-within:border-sage focus-within:bg-card focus-within:ring-2 focus-within:ring-sage/10 transition-all duration-200">
          <span className="font-mono text-[10px] text-mustard/80 font-bold mr-0.5">R$</span>
          <input
            id={`price-${item.id}`}
            type="text"
            value={priceInput}
            onChange={(e) => setPriceInput(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            placeholder="0,00"
            className="font-mono text-[13px] font-bold text-mustard bg-transparent border-none text-right rounded w-16 outline-none"
            aria-label="Preço estimado do item"
          />
        </div>

        {/* Delete button */}
        <button
          id={`del-${item.id}`}
          type="button"
          onClick={() => onDelete(item.id)}
          className="w-8 h-8 rounded-xl border-none bg-transparent text-ink-soft/60 flex items-center justify-center cursor-pointer transition-all duration-200 hover:bg-tomato/10 hover:text-tomato active:scale-90"
          aria-label="Excluir item"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}
