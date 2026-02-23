import { createContext, useContext, useCallback } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

const FavoritesContext = createContext(null);

export function FavoritesProvider({ children }) {
  const [favoritePlayerIds, setFavoritePlayerIds] = useLocalStorage('nfl-favorite-players', []);
  const [favoriteTeamIds, setFavoriteTeamIds] = useLocalStorage('nfl-favorite-teams', []);

  const toggleFavoritePlayer = useCallback((playerId) => {
    setFavoritePlayerIds((prev) =>
      prev.includes(playerId)
        ? prev.filter((id) => id !== playerId)
        : [...prev, playerId]
    );
  }, [setFavoritePlayerIds]);

  const toggleFavoriteTeam = useCallback((teamId) => {
    setFavoriteTeamIds((prev) =>
      prev.includes(teamId)
        ? prev.filter((id) => id !== teamId)
        : [...prev, teamId]
    );
  }, [setFavoriteTeamIds]);

  const isPlayerFavorite = useCallback(
    (playerId) => favoritePlayerIds.includes(playerId),
    [favoritePlayerIds]
  );

  const isTeamFavorite = useCallback(
    (teamId) => favoriteTeamIds.includes(teamId),
    [favoriteTeamIds]
  );

  const value = {
    favoritePlayerIds,
    favoriteTeamIds,
    toggleFavoritePlayer,
    toggleFavoriteTeam,
    isPlayerFavorite,
    isTeamFavorite,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
