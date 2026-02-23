import { useState } from 'react';
import styles from './TeamLogo.module.css';

const sizeMap = {
  sm: 32,
  md: 48,
  lg: 72,
};

function TeamLogo({ logoUrl, teamName, size = 'md' }) {
  const [hasError, setHasError] = useState(false);

  const dimension = sizeMap[size] || sizeMap.md;

  if (hasError || !logoUrl) {
    return (
      <div
        className={`${styles.placeholder} ${styles[size]}`}
        style={{ width: dimension, height: dimension }}
        aria-label={teamName || 'Team logo'}
      >
        {teamName ? teamName.charAt(0).toUpperCase() : '?'}
      </div>
    );
  }

  return (
    <img
      className={`${styles.logo} ${styles[size]}`}
      src={logoUrl}
      alt={teamName || 'Team logo'}
      width={dimension}
      height={dimension}
      onError={() => setHasError(true)}
    />
  );
}

export default TeamLogo;
