import { useParams, Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import ScheduleRow from '../../components/ScheduleRow/ScheduleRow';
import { useApi } from '../../hooks/useApi';
import { getTeamSchedule } from '../../services/scheduleService';
import { getAllTeams } from '../../services/teamService';
import { CURRENT_SEASON } from '../../utils/constants';
import styles from './TeamSchedule.module.css';

function TeamSchedule() {
  const { teamId } = useParams();

  const {
    data: schedule,
    loading: schedLoading,
    error: schedError,
    retry: retrySchedule,
  } = useApi(() => getTeamSchedule(teamId, CURRENT_SEASON), [teamId]);

  const { data: teams } = useApi(getAllTeams, []);

  const team = teams?.find((t) => String(t.id) === String(teamId));

  return (
    <div className={styles.page}>
      <div
        className={styles.teamHeader}
        style={{
          borderLeftColor: team?.color ? `#${team.color}` : 'var(--color-primary)',
        }}
      >
        <div className={styles.teamHeaderContent}>
          {team?.logo && (
            <img src={team.logo} alt={team.displayName} className={styles.teamLogo} />
          )}
          <div>
            <h1 className={styles.teamName}>{team?.displayName || `Team ${teamId}`}</h1>
            {team?.record && <span className={styles.record}>{team.record}</span>}
            <span className={styles.season}>{CURRENT_SEASON} Season Schedule</span>
          </div>
        </div>
        <Link to="/teams" className={styles.backLink}>&larr; All Teams</Link>
      </div>

      {schedLoading && <LoadingSpinner message="Loading schedule..." />}
      {schedError && <ErrorMessage message={schedError} onRetry={retrySchedule} />}

      {!schedLoading && !schedError && schedule && schedule.length === 0 && (
        <div className={styles.noSchedule}>
          <h2>Schedule Not Yet Available</h2>
          <p>The {CURRENT_SEASON} NFL schedule has not been released yet. Check back later.</p>
        </div>
      )}

      {schedule && schedule.length > 0 && (
        <div className={styles.scheduleList}>
          {schedule.map((game) => (
            <ScheduleRow key={game.id} game={game} highlightTeamId={teamId} />
          ))}
        </div>
      )}
    </div>
  );
}

export default TeamSchedule;
