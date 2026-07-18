import React from 'react';
import { ShoppingItem, Category } from '../types';
import ItemRow from './ItemRow';
import { ChevronDown, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CategorySectionProps {
  category: string;
  items: ShoppingItem[];
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onToggleChecked: (id: string) => void;
  onDelete: (id: string) => void;
  onUpdatePrice: (id: string, price: number) => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  "Hortifruti": "🥦",
  "Açougue e Peixaria": "🥩",
  "Padaria": "🥖",
  "Laticínios e Frios": "🧀",
  "Mercearia": "🥫",
  "Bebidas": "🍷",
  "Limpeza": "🧼",
  "Higiene e Beleza": "🧴",
  "Outros": "📦",
  "No Carrinho / Comprados": "🛒"
};

export default function CategorySection({
  category,
  items,
  isCollapsed,
  onToggleCollapse,
  onToggleChecked,
  onDelete,
  onUpdatePrice,
}: CategorySectionProps) {
  if (items.length === 0) return null;

  const checkedCount = items.filter((item) => item.checked).length;
  const isGlobalCart = category === "No Carrinho / Comprados";
  const icon = CATEGORY_ICONS[category] || "🏷️";

  return (
    <div className="mb-5" id={`section-${category.toLowerCase().replace(/[^a-z0-9]/g, '-')}`}>
      {/* Category Section Header */}
      <div
        id={`head-${category.replace(/\s+/g, '-')}`}
        onClick={onToggleCollapse}
        className="flex items-center justify-between cursor-pointer py-2 px-1 select-none hover:bg-paper-alt/40 rounded-xl transition-all duration-200"
      >
        <div className="font-serif font-bold text-[16px] text-ink flex items-center gap-2.5">
          <span className="text-[18px]">{icon}</span>
          <span>{category}</span>
          <span className="font-mono text-[10.5px] font-bold text-sage bg-sage-bg border border-sage/10 px-2 py-0.5 rounded-lg shadow-2xs">
            {isGlobalCart ? items.length : `${checkedCount} / ${items.length}`}
          </span>
        </div>
        <motion.div
          animate={{ rotate: isCollapsed ? -90 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="text-ink-soft/70"
        >
          <ChevronDown size={15} strokeWidth={2.5} />
        </motion.div>
      </div>

      {/* Items List */}
      <AnimatePresence initial={false}>
        {!isCollapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="overflow-hidden mt-2"
          >
            <div className="flex flex-col gap-2.5 pl-0.5">
              <AnimatePresence mode="popLayout">
                {items.map((item) => (
                  <motion.div
                     key={item.id}
                     layout
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, scale: 0.95 }}
                     transition={{ duration: 0.2 }}
                  >
                    <ItemRow
                      item={item}
                      onToggleChecked={onToggleChecked}
                      onDelete={onDelete}
                      onUpdatePrice={onUpdatePrice}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

