/**
 * Formata um número para o padrão de moeda brasileiro (R$).
 */
export function fmtMoney(value: number): string {
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

/**
 * Converte uma string de preço brasileiro para um número float utilizável.
 * Trata formatos como "R$ 5,50", "5,50", "1.250,00" ou "12.50".
 */
export function parsePrice(str: string): number {
  if (!str) return 0;
  // Remove caracteres que não sejam dígitos, vírgulas, pontos ou sinal de menos
  let cleaned = str.replace(/[^\d,.-]/g, '');
  // Se houver pontos de milhar antes da vírgula decimal, remove-os
  cleaned = cleaned.replace(/\.(?=\d{3},)/g, '');
  // Substitui a vírgula decimal por ponto para conversão float padrão
  cleaned = cleaned.replace(',', '.');
  const n = parseFloat(cleaned);
  return isNaN(n) ? 0 : n;
}
