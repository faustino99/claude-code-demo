import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import styles from './Navbar.module.css';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <div className={styles.inner}>
        <NavLink to="/" className={styles.brand} onClick={closeMenu}>
          NFL Tracker
        </NavLink>

        <button
          className={styles.hamburger}
          onClick={toggleMenu}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
          <span className={styles.hamburgerLine}></span>
        </button>

        <div className={`${styles.links} ${menuOpen ? styles.linksOpen : ''}`}>
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ''}`
            }
            onClick={closeMenu}
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/players"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ''}`
            }
            onClick={closeMenu}
          >
            Players
          </NavLink>
          <NavLink
            to="/teams"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ''}`
            }
            onClick={closeMenu}
          >
            Teams
          </NavLink>
          <NavLink
            to="/trades"
            className={({ isActive }) =>
              `${styles.link} ${isActive ? styles.linkActive : ''}`
            }
            onClick={closeMenu}
          >
            Trade Rumors
          </NavLink>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
