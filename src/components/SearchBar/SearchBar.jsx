import { useState } from 'react';
import styles from './SearchBar.module.css';

function SearchBar({
  onSearch,
  placeholder = 'Search NFL players...',
  initialValue = '',
}) {
  const [value, setValue] = useState(initialValue);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <label className={styles.iconLabel} htmlFor="search-input">
        Search
      </label>
      <input
        id="search-input"
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
      <button type="submit" className={styles.button}>
        Search
      </button>
    </form>
  );
}

export default SearchBar;
