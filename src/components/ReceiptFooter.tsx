import React from 'react';
import { ShoppingItem } from '../types';
import { fmtMoney } from '../utils';
import { ShoppingCart } from 'lucide-react';

interface ReceiptFooterProps {
  items: ShoppingItem[];
}

export default function ReceiptFooter({ items }: ReceiptFooterProps) {
  const totalItems = items.length;
  const checkedItems = items.filter((item) => item.checked).length;

  const totalEst = items.reduce((sum, item) => sum + (item.price || 0), 0);
  const totalSpent = items.filter((item) => item.checked).reduce((sum, item) => sum + (item.price || 0), 0);

  // Calcula a porcentagem do progresso
  const progressPercent = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  return (
    <div className="fixed left-0 right-0 bottom-0 z-50 max-w-[560px] mx-auto w-full px-4 pb-4" id="app-receipt-footer">
      <div className="bg-ink text-paper rounded-2xl p-4.5 shadow-2xl border border-line/10 flex flex-col gap-3.5 backdrop-blur-md bg-ink/95">
        
        {/* Progress Bar with modern clean design */}
        {totalItems > 0 && (
          <div className="space-y-1.5" id="receipt-progress-bar">
            <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest opacity-60">
              <span className="flex items-center gap-1.5">
                <ShoppingCart size={11} className="text-sage" /> Progresso da compra
              </span>
              <span>{progressPercent}%</span>
            </div>
            <div className="w-full h-1.5 bg-paper/10 rounded-full overflow-hidden">
              <div 
                className="h-full bg-sage rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between gap-4">
          {/* Left Section - Items Count */}
          <div className="flex flex-col">
            <span className="font-mono text-[9px] uppercase tracking-widest opacity-50">
              No Carrinho
            </span>
            <span className="font-serif font-bold text-xl text-paper" id="receipt-items-count">
              {checkedItems} <span className="text-paper/40 text-sm font-sans font-normal">de</span> {totalItems}
            </span>
          </div>

          {/* Right Section - Total Estimates */}
          <div className="flex gap-4 text-right">
            <div className="flex flex-col">
              <span className="font-mono text-[9px] uppercase tracking-widest opacity-50">
                Estimado
              </span>
              <span className="font-mono text-[15px] font-semibold opacity-80" id="receipt-total-est">
                {fmtMoney(totalEst)}
              </span>
            </div>
            
            <div className="flex flex-col border-l border-paper/10 pl-4">
              <span className="font-mono text-[9px] uppercase tracking-widest text-[#8FBF9F]">
                Comprado
              </span>
              <span className="font-mono text-[17px] font-bold text-mustard" id="receipt-total-spent">
                {fmtMoney(totalSpent)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

