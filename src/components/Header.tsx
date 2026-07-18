import React from 'react';

export default function Header() {
  return (
    <header className="py-2 px-1 mb-4" id="app-header">
      <div className="font-mono text-[11px] tracking-wider uppercase text-sage font-semibold flex items-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-sage inline-block animate-pulse"></span>
        Lista Compartilhada
      </div>
      <h1 className="font-serif font-semibold text-3xl sm:text-4xl leading-tight mt-1.5 mb-1 text-ink">
        No <em className="italic text-tomato not-italic-siblings">mercado</em>, juntos.
      </h1>
      <p className="text-ink-soft text-sm font-sans">
        Adicione, marque e acompanhe o valor em tempo real.
      </p>
    </header>
  );
}
