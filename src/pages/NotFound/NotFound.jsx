import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

function NotFound() {
  return (
    <div className={styles.container}>
      <h1 className={styles.code}>404</h1>
      <h2 className={styles.heading}>Page Not Found</h2>
      <p className={styles.message}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link to="/" className={styles.homeLink}>Back to Dashboard</Link>
    </div>
  );
}

export default NotFound;
