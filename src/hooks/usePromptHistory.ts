import { useLocalStorage } from './useLocalStorage';
import { PromptHistoryItem } from '../types';

export function usePromptHistory() {
  const [history, setHistory] = useLocalStorage<PromptHistoryItem[]>('prompt-history', []);

  const addToHistory = (item: Omit<PromptHistoryItem, 'id' | 'timestamp' | 'isFavorite'>) => {
    const newItem: PromptHistoryItem = {
      ...item,
      id: Date.now(),
      timestamp: new Date().toISOString(),
      isFavorite: false,
    };
    setHistory([newItem, ...history].slice(0, 20));
    return newItem;
  };

  const toggleFavorite = (id: number) => {
    setHistory(
      history.map(item =>
        item.id === id ? { ...item, isFavorite: !item.isFavorite } : item
      )
    );
  };

  const deleteItem = (id: number) => {
    setHistory(history.filter(item => item.id !== id));
  };

  return {
    history,
    setHistory,
    addToHistory,
    toggleFavorite,
    deleteItem,
  };
}