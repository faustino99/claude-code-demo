import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SearchBar from '../../components/SearchBar/SearchBar';
import TradeStatusBadge from '../../components/TradeStatusBadge/TradeStatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { useApi } from '../../hooks/useApi';
import { getAllTeams } from '../../services/teamService';
import { getTradeRumors } from '../../services/tradeService';
import { getScoreboard } from '../../services/scheduleService';
import { formatDate, formatGameTime } from '../../utils/formatters';
import styles from './Dashboard.module.css';

function Dashboard() {
  const navigate = useNavigate();
  const { data: teams, loading: teamsLoading, error: teamsError, retry: retryTeams } = useApi(getAllTeams, []);
  const tradeRumors = getTradeRumors().slice(0, 5);

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/players?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className={styles.dashboard}>
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>NFL Player Tracker</h1>
        <p className={styles.heroSubtitle}>
          Track player stats, trade rumors, and team schedules for the 2026 NFL season
        </p>
        <div className={styles.heroSearch}>
          <SearchBar onSearch={handleSearch} placeholder="Search for any NFL player..." />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Trade Buzz</h2>
          <Link to="/trades" className={styles.viewAll}>View All</Link>
        </div>
        <div className={styles.tradeList}>
          {tradeRumors.map((rumor) => (
            <div key={rumor.playerId} className={styles.tradeCard}>
              <div className={styles.tradeCardHeader}>
                <Link to={`/players/${rumor.playerId}`} className={styles.tradePlayerName}>
                  {rumor.playerName}
                </Link>
                <TradeStatusBadge status={rumor.status} compact />
              </div>
              <p className={styles.tradeTeams}>
                <span className={styles.teamAbbrev}>{rumor.currentTeamAbbrev}</span>
                <span className={styles.arrow}>&rarr;</span>
                <span>{rumor.rumoredTeams.join(', ')}</span>
              </p>
              <p className={styles.tradeHeadline}>{rumor.headline}</p>
            </div>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>NFL Teams</h2>
          <Link to="/teams" className={styles.viewAll}>View All</Link>
        </div>
        {teamsLoading && <LoadingSpinner message="Loading teams..." />}
        {teamsError && <ErrorMessage message={teamsError} onRetry={retryTeams} />}
        {teams && (
          <div className={styles.teamGrid}>
            {teams.map((team) => (
              <Link
                key={team.id}
                to={`/teams/${team.id}/schedule`}
                className={styles.teamCard}
              >
                <div
                  className={styles.teamLogoPlaceholder}
                  style={{ backgroundColor: team.color ? `#${team.color}` : '#013369' }}
                >
                  {team.logo ? (
                    <img src={team.logo} alt={team.displayName} className={styles.teamLogoImg} />
                  ) : (
                    <span className={styles.teamInitial}>{team.abbreviation}</span>
                  )}
                </div>
                <span className={styles.teamName}>{team.shortName || team.displayName}</span>
                {team.record && <span className={styles.teamRecord}>{team.record}</span>}
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;
