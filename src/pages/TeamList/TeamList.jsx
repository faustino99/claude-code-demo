import { Link } from 'react-router-dom';
import LoadingSpinner from '../../components/LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../../components/ErrorMessage/ErrorMessage';
import { useApi } from '../../hooks/useApi';
import { getAllTeams } from '../../services/teamService';
import { groupBy } from '../../utils/helpers';
import styles from './TeamList.module.css';

const DIVISION_ORDER = ['East', 'North', 'South', 'West'];

function TeamList() {
  const { data: teams, loading, error, retry } = useApi(getAllTeams, []);

  if (loading) return <LoadingSpinner message="Loading NFL teams..." />;
  if (error) return <ErrorMessage message={error} onRetry={retry} />;
  if (!teams || teams.length === 0) return <p>No teams found.</p>;

  const byConference = groupBy(teams, (t) => t.conference || 'NFL');

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>NFL Teams</h1>

      {['AFC', 'NFC'].map((conf) => {
        const confTeams = byConference[conf] || [];
        const byDivision = groupBy(confTeams, (t) => t.division || 'Unknown');

        return (
          <section key={conf} className={styles.conference}>
            <h2 className={styles.confTitle}>{conf}</h2>
            <div className={styles.divisions}>
              {DIVISION_ORDER.map((div) => {
                const divTeams = byDivision[div] || [];
                if (divTeams.length === 0) return null;
                return (
                  <div key={div} className={styles.division}>
                    <h3 className={styles.divTitle}>{conf} {div}</h3>
                    <div className={styles.teamGrid}>
                      {divTeams.map((team) => (
                        <Link
                          key={team.id}
                          to={`/teams/${team.id}/schedule`}
                          className={styles.teamCard}
                        >
                          <div
                            className={styles.teamLogo}
                            style={{ backgroundColor: team.color ? `#${team.color}` : '#013369' }}
                          >
                            {team.logo ? (
                              <img src={team.logo} alt={team.displayName} className={styles.logoImg} />
                            ) : (
                              <span className={styles.logoText}>{team.abbreviation}</span>
                            )}
                          </div>
                          <div className={styles.teamInfo}>
                            <span className={styles.teamName}>{team.displayName}</span>
                            {team.record && (
                              <span className={styles.teamRecord}>{team.record}</span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}

export default TeamList;
