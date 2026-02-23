import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import PlayerCard from '../../components/PlayerCard/PlayerCard';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { searchPlayers } from '../../services/playerService';
import { getTradeStatus } from '../../services/tradeService';
import { useDebounce } from '../../hooks/useDebounce';
import styles from './PlayerSearch.module.css';

function PlayerSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [players, setPlayers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searched, setSearched] = useState(!!initialQuery);

  const debouncedQuery = useDebounce(query, 400);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setPlayers([]);
      setSearched(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);
    setSearched(true);

    searchPlayers(debouncedQuery.trim())
      .then((results) => {
        if (!cancelled) {
          const enriched = results.map((p) => ({
            ...p,
            tradeStatus: getTradeStatus(p.id),
          }));
          setPlayers(enriched);
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || 'Search failed');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  const handleSearch = (value) => {
    setQuery(value);
    if (value.trim()) {
      setSearchParams({ q: value.trim() });
    } else {
      setSearchParams({});
    }
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Player Search</h1>
      <div className={styles.searchWrapper}>
        <SearchBar
          onSearch={handleSearch}
          placeholder="Search NFL players by name..."
          initialValue={initialQuery}
        />
      </div>

      {loading && <LoadingSpinner message="Searching players..." />}
      {error && <ErrorMessage message={error} onRetry={() => handleSearch(query)} />}

      {!loading && !error && searched && players.length === 0 && (
        <p className={styles.empty}>No players found matching &ldquo;{debouncedQuery}&rdquo;</p>
      )}

      {!loading && !error && !searched && (
        <div className={styles.prompt}>
          <p>Search for any NFL player by name to see their stats, team, and trade status.</p>
        </div>
      )}

      {players.length > 0 && (
        <div className={styles.grid}>
          {players.map((player) => (
            <PlayerCard key={player.id} player={player} />
          ))}
        </div>
      )}
    </div>
  );
}

export default PlayerSearch;
