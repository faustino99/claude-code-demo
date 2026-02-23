import styles from './TradeStatusBadge.module.css';

const statusConfig = {
  rumored: { label: 'Trade Rumored', compactLabel: 'Rumored', className: 'rumored' },
  likely: { label: 'Trade Likely', compactLabel: 'Likely', className: 'likely' },
  confirmed: { label: 'Trade Confirmed', compactLabel: 'Confirmed', className: 'confirmed' },
};

function TradeStatusBadge({ status, compact = false }) {
  if (!status || status === 'none') {
    return null;
  }

  const config = statusConfig[status];

  if (!config) {
    return null;
  }

  return (
    <span className={`${styles.badge} ${styles[config.className]}`}>
      {compact ? config.compactLabel : config.label}
    </span>
  );
}

export default TradeStatusBadge;
