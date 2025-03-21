import { useState, useEffect } from 'react';

/**
 * Hook para aplicar debounce em um valor, útil para operações como filtragem/busca
 * que não devem ser executadas a cada tecla pressionada
 * 
 * @param value O valor que deseja aplicar debounce
 * @param delay Tempo em milissegundos para o debounce
 * @returns O valor após o debounce
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Configura o timeout para atualizar o valor após o delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Limpa o timeout se o valor mudar antes do delay
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
} 