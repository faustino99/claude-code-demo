import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import TradeStatusBadge from '../../components/TradeStatusBadge/TradeStatusBadge';
import { getTradeRumors } from '../../services/tradeService';
import styles from './TradeRumors.module.css';

const STATUS_FILTERS = ['all', 'rumored', 'likely', 'confirmed'];

function TradeRumors() {
  const allRumors = getTradeRumors();
  const [statusFilter, setStatusFilter] = useState('all');
  const [teamFilter, setTeamFilter] = useState('all');

  const uniqueTeams = useMemo(() => {
    const teams = [...new Set(allRumors.map((r) => r.currentTeamAbbrev))].sort();
    return teams;
  }, [allRumors]);

  const filteredRumors = useMemo(() => {
    let filtered = allRumors;
    if (statusFilter !== 'all') {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }
    if (teamFilter !== 'all') {
      filtered = filtered.filter((r) => r.currentTeamAbbrev === teamFilter);
    }
    return filtered;
  }, [allRumors, statusFilter, teamFilter]);

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Trade Rumors</h1>

      <div className={styles.filters}>
        <div className={styles.statusFilters}>
          {STATUS_FILTERS.map((status) => (
            <button
              key={status}
              className={`${styles.filterBtn} ${statusFilter === status ? styles.filterActive : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
        <select
          className={styles.teamSelect}
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
        >
          <option value="all">All Teams</option>
          {uniqueTeams.map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {filteredRumors.length === 0 && (
        <p className={styles.empty}>No trade rumors match your filter.</p>
      )}

      <div className={styles.rumorList}>
        {filteredRumors.map((rumor) => {
          const borderColor =
            rumor.status === 'confirmed'
              ? 'var(--color-trade-confirmed)'
              : rumor.status === 'likely'
                ? 'var(--color-trade-likely)'
                : 'var(--color-trade-rumored)';

          return (
            <div
              key={rumor.playerId}
              className={styles.rumorCard}
              style={{ borderLeftColor: borderColor }}
            >
              <div className={styles.rumorHeader}>
                <div className={styles.rumorPlayerInfo}>
                  <Link to={`/players/${rumor.playerId}`} className={styles.playerName}>
                    {rumor.playerName}
                  </Link>
                  <span className={styles.playerPos}>{rumor.position}</span>
                </div>
                <TradeStatusBadge status={rumor.status} />
              </div>

              <div className={styles.rumorTeams}>
                <span className={styles.currentTeam}>{rumor.currentTeam}</span>
                <span className={styles.arrow}>&rarr;</span>
                <span className={styles.rumoredTeams}>{rumor.rumoredTeams.join(', ')}</span>
              </div>

              <h3 className={styles.headline}>{rumor.headline}</h3>
              <p className={styles.details}>{rumor.details}</p>

              <div className={styles.rumorMeta}>
                <span className={styles.source}>{rumor.source}</span>
                <span className={styles.date}>{rumor.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default TradeRumors;
