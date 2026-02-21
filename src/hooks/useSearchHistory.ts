import { useState, useEffect, useCallback } from 'react';

const HISTORY_KEY = 'ifsc-search-history';

export interface SearchHistoryItem {
  ifsc: string;
  bankName: string;
  branchName: string;
  city: string;
  searchedAt: number;
}

export function useSearchHistory() {
  const [history, setHistory] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (stored) {
      try {
        setHistory(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing search history:', e);
      }
    }
  }, []);

  const addToHistory = useCallback((item: Omit<SearchHistoryItem, 'searchedAt'>) => {
    setHistory(prev => {
      // Remove duplicate if exists
      const filtered = prev.filter(h => h.ifsc !== item.ifsc);
      const newItem: SearchHistoryItem = { ...item, searchedAt: Date.now() };
      const updated = [newItem, ...filtered].slice(0, 10); // Keep last 10
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromHistory = useCallback((ifsc: string) => {
    setHistory(prev => {
      const updated = prev.filter(h => h.ifsc !== ifsc);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
    localStorage.removeItem(HISTORY_KEY);
  }, []);

  return {
    history,
    addToHistory,
    removeFromHistory,
    clearHistory,
  };
}
