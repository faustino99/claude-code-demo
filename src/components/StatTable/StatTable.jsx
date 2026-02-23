import styles from './StatTable.module.css';

function StatTable({ title, headers, rows }) {
  return (
    <div className={styles.container}>
      {title && <h3 className={styles.title}>{title}</h3>}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {headers.map((header, index) => (
                <th key={index} className={styles.th}>
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows && rows.length > 0 ? (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={styles.row}>
                  {row.map((cell, cellIndex) => (
                    <td key={cellIndex} className={styles.td}>
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  className={styles.emptyMessage}
                  colSpan={headers.length}
                >
                  No stats available.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StatTable;
