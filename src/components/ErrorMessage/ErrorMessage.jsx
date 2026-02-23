import styles from './ErrorMessage.module.css';

function ErrorMessage({ message, onRetry }) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>!</div>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.retryButton} onClick={onRetry}>
          Try Again
        </button>
      )}
    </div>
  );
}

export default ErrorMessage;
