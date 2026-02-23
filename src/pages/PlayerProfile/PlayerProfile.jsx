import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import TradeStatusBadge from '../../components/TradeStatusBadge/TradeStatusBadge';
import StatTable from '../../components/StatTable/StatTable';
import { useApi } from '../../hooks/useApi';
import { getPlayerProfile, getPlayerStats } from '../../services/playerService';
import { getTradeRumorForPlayer } from '../../services/tradeService';
import { formatHeight, formatWeight } from '../../utils/formatters';
import styles from './PlayerProfile.module.css';

function PlayerProfile() {
  const { playerId } = useParams();

  const {
    data: player,
    loading: playerLoading,
    error: playerError,
    retry: retryPlayer,
  } = useApi(() => getPlayerProfile(playerId), [playerId]);

  const {
    data: statsData,
    loading: statsLoading,
    error: statsError,
    retry: retryStats,
  } = useApi(() => getPlayerStats(playerId), [playerId]);

  const tradeRumor = getTradeRumorForPlayer(playerId);

  if (playerLoading) return <LoadingSpinner message="Loading player profile..." />;
  if (playerError) return <ErrorMessage message={playerError} onRetry={retryPlayer} />;
  if (!player) return <ErrorMessage message="Player not found." />;

  const draftText = player.draft?.year
    ? `${player.draft.year} Round ${player.draft.round}, Pick ${player.draft.pick}${player.draft.team ? ` (${player.draft.team})` : ''}`
    : null;

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          {player.headshot ? (
            <img src={player.headshot} alt={player.fullName} className={styles.headshot} />
          ) : (
            <div className={styles.headshotPlaceholder}>
              {player.firstName?.[0]}{player.lastName?.[0]}
            </div>
          )}
        </div>
        <div className={styles.headerInfo}>
          <div className={styles.nameRow}>
            <h1 className={styles.name}>{player.fullName}</h1>
            {player.jersey && <span className={styles.jersey}>#{player.jersey}</span>}
          </div>
          <div className={styles.meta}>
            <span className={styles.position}>{player.positionName || player.position}</span>
            {player.teamName && (
              <Link to={`/teams/${player.teamId}/schedule`} className={styles.team}>
                {player.teamName}
              </Link>
            )}
          </div>
          <TradeStatusBadge status={player.tradeStatus} />
        </div>
      </div>

      <div className={styles.bio}>
        <h2 className={styles.sectionTitle}>Bio</h2>
        <div className={styles.bioGrid}>
          {player.height && (
            <div className={styles.bioItem}>
              <span className={styles.bioLabel}>Height</span>
              <span className={styles.bioValue}>{formatHeight(player.height)}</span>
            </div>
          )}
          {player.weight && (
            <div className={styles.bioItem}>
              <span className={styles.bioLabel}>Weight</span>
              <span className={styles.bioValue}>{formatWeight(player.weight)}</span>
            </div>
          )}
          {player.experience !== '' && (
            <div className={styles.bioItem}>
              <span className={styles.bioLabel}>Experience</span>
              <span className={styles.bioValue}>{player.experience} yrs</span>
            </div>
          )}
          {player.college && (
            <div className={styles.bioItem}>
              <span className={styles.bioLabel}>College</span>
              <span className={styles.bioValue}>{player.college}</span>
            </div>
          )}
          {draftText && (
            <div className={styles.bioItem}>
              <span className={styles.bioLabel}>Draft</span>
              <span className={styles.bioValue}>{draftText}</span>
            </div>
          )}
        </div>
      </div>

      <div className={styles.statsSection}>
        <h2 className={styles.sectionTitle}>Statistics</h2>
        {statsLoading && <LoadingSpinner message="Loading stats..." />}
        {statsError && <ErrorMessage message={statsError} onRetry={retryStats} />}
        {statsData && statsData.categories?.length > 0 ? (
          statsData.categories.map((cat) => (
            <StatTable
              key={cat.name}
              title={cat.name}
              headers={cat.headers}
              rows={cat.rows.map((r) => {
                if (Array.isArray(r)) return r;
                if (r.displayValue) return [r.displayValue];
                return Object.values(r);
              })}
            />
          ))
        ) : (
          !statsLoading && !statsError && (
            <p className={styles.noStats}>No stats available for this player.</p>
          )
        )}
      </div>

      {tradeRumor && (
        <div className={styles.tradeSection}>
          <h2 className={styles.sectionTitle}>Trade Status</h2>
          <div className={styles.tradeCard}>
            <div className={styles.tradeHeader}>
              <TradeStatusBadge status={tradeRumor.status} />
              <span className={styles.tradeDate}>{tradeRumor.date}</span>
            </div>
            <h3 className={styles.tradeHeadline}>{tradeRumor.headline}</h3>
            <p className={styles.tradeTeams}>
              <strong>{tradeRumor.currentTeamAbbrev}</strong>
              <span className={styles.arrow}>&rarr;</span>
              {tradeRumor.rumoredTeams.join(', ')}
            </p>
            <p className={styles.tradeDetails}>{tradeRumor.details}</p>
            <p className={styles.tradeSource}>Source: {tradeRumor.source}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayerProfile;
