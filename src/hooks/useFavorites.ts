import { useState, useEffect, useCallback } from 'react';
import { IFSCData } from '@/lib/csvParser';

const FAVORITES_KEY = 'ifsc-favorites';

export interface FavoriteBranch {
  ifsc: string;
  bankName: string;
  branchName: string;
  city: string;
  state: string;
  addedAt: number;
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<FavoriteBranch[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(FAVORITES_KEY);
    if (stored) {
      try {
        setFavorites(JSON.parse(stored));
      } catch (e) {
        console.error('Error parsing favorites:', e);
      }
    }
  }, []);

  const saveFavorites = useCallback((newFavorites: FavoriteBranch[]) => {
    setFavorites(newFavorites);
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
  }, []);

  const addFavorite = useCallback((branch: IFSCData) => {
    const newFavorite: FavoriteBranch = {
      ifsc: branch.IFSC,
      bankName: branch.Bank,
      branchName: branch.Branch,
      city: branch.City,
      state: branch.State,
      addedAt: Date.now(),
    };
    
    setFavorites(prev => {
      if (prev.some(f => f.ifsc === branch.IFSC)) return prev;
      const updated = [newFavorite, ...prev].slice(0, 50); // Max 50 favorites
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFavorite = useCallback((ifsc: string) => {
    setFavorites(prev => {
      const updated = prev.filter(f => f.ifsc !== ifsc);
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback((ifsc: string) => {
    return favorites.some(f => f.ifsc === ifsc);
  }, [favorites]);

  const toggleFavorite = useCallback((branch: IFSCData) => {
    if (isFavorite(branch.IFSC)) {
      removeFavorite(branch.IFSC);
    } else {
      addFavorite(branch);
    }
  }, [isFavorite, removeFavorite, addFavorite]);

  return {
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite,
    clearFavorites: () => saveFavorites([]),
  };
}
