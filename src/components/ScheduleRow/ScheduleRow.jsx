import TeamLogo from '../TeamLogo/TeamLogo';
import styles from './ScheduleRow.module.css';

function ScheduleRow({ game, highlightTeamId }) {
  const {
    week,
    date,
    homeTeamName,
    homeTeamAbbrev,
    homeTeamLogo,
    awayTeamName,
    awayTeamAbbrev,
    awayTeamLogo,
    homeScore,
    awayScore,
    status,
    venue,
    broadcast,
  } = game;

  const isCompleted = status === 'completed' || status === 'final';
  const isInProgress = status === 'in_progress' || status === 'live';

  let resultClass = '';
  if (isCompleted && highlightTeamId) {
    const isHome = highlightTeamId === game.homeTeamId;
    const isAway = highlightTeamId === game.awayTeamId;

    if (isHome && homeScore > awayScore) {
      resultClass = styles.win;
    } else if (isAway && awayScore > homeScore) {
      resultClass = styles.win;
    } else if (isHome && homeScore < awayScore) {
      resultClass = styles.loss;
    } else if (isAway && awayScore < homeScore) {
      resultClass = styles.loss;
    }
  }

  return (
    <div className={`${styles.row} ${resultClass}`}>
      <div className={styles.week}>
        <span className={styles.weekLabel}>WK</span>
        <span className={styles.weekNumber}>{week}</span>
      </div>

      <div className={styles.date}>{date}</div>

      <div className={styles.matchup}>
        <div className={styles.team}>
          <TeamLogo logoUrl={awayTeamLogo} teamName={awayTeamName} size="sm" />
          <span className={styles.teamAbbrev}>{awayTeamAbbrev}</span>
        </div>
        <span className={styles.at}>@</span>
        <div className={styles.team}>
          <TeamLogo logoUrl={homeTeamLogo} teamName={homeTeamName} size="sm" />
          <span className={styles.teamAbbrev}>{homeTeamAbbrev}</span>
        </div>
      </div>

      <div className={styles.score}>
        {isCompleted || isInProgress ? (
          <span className={styles.scoreText}>
            {awayScore} - {homeScore}
          </span>
        ) : (
          <span className={styles.gameTime}>{status || 'TBD'}</span>
        )}
      </div>

      <div className={styles.meta}>
        {venue && <span className={styles.venue}>{venue}</span>}
        {broadcast && <span className={styles.broadcast}>{broadcast}</span>}
      </div>
    </div>
  );
}

export default ScheduleRow;
