import { useState } from 'react';
import { Link } from 'react-router-dom';
import TradeStatusBadge from '../TradeStatusBadge/TradeStatusBadge';
import styles from './PlayerCard.module.css';

function PlayerCard({ player }) {
  const [imgError, setImgError] = useState(false);

  const {
    id,
    fullName,
    position,
    teamName,
    teamAbbrev,
    jersey,
    headshot,
    tradeStatus,
  } = player;

  return (
    <Link to={`/players/${id}`} className={styles.card}>
      <div className={styles.imageContainer}>
        {headshot && !imgError ? (
          <img
            className={styles.headshot}
            src={headshot}
            alt={fullName}
            onError={() => setImgError(true)}
          />
        ) : (
          <div className={styles.headshotPlaceholder}>
            {fullName ? fullName.charAt(0) : '?'}
          </div>
        )}
      </div>

      <div className={styles.info}>
        <h3 className={styles.name}>{fullName}</h3>
        <p className={styles.details}>
          <span className={styles.position}>{position}</span>
          {jersey && <span className={styles.jersey}>#{jersey}</span>}
        </p>
        <p className={styles.team}>
          {teamName}
          {teamAbbrev && (
            <span className={styles.abbrev}> ({teamAbbrev})</span>
          )}
        </p>
        {tradeStatus && tradeStatus !== 'none' && (
          <div className={styles.tradeStatus}>
            <TradeStatusBadge status={tradeStatus} compact />
          </div>
        )}
      </div>
    </Link>
  );
}

export default PlayerCard;
