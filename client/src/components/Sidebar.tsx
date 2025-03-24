import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/slices/userSlice' // ודא שייבאת את פונקציית ה-logout מ-Redux

const Sidebar: React.FC = () => {
  const dispatch = useDispatch() // מאפשר לבצע פעולות Redux

  const handleLogout = () => {
    dispatch(logout()) // מבצע את פעולת ה-logout ב-Redux
    localStorage.removeItem('persist:root') // מנקה את ה-persisted state
    window.location.href = '/login' // ניתוב מחדש לדף התחברות
  }

  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>Menu</h2>
      <ul style={styles.menu}>
        <li>
          <Link to="/home" style={styles.link}>
            Home
          </Link>
        </li>
        <li>
          <Link to="/profile" style={styles.link}>
            Profile
          </Link>
        </li>
        <li>
          <Link to="/settings" style={styles.link}>
            Settings
          </Link>
        </li>
        <li>
          <button style={styles.logoutButton} onClick={handleLogout}>
            Logout
          </button>
        </li>
      </ul>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    width: '300px',
    height: '100vh',
    backgroundColor: '#333',
    color: '#fff',
    padding: '20px',
    boxSizing: 'border-box' as 'border-box',
  },
  title: {
    fontSize: '20px',
    marginBottom: '20px',
  },
  menu: {
    listStyleType: 'none' as 'none',
    padding: 0,
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    display: 'block',
    marginBottom: '10px',
  },
  logoutButton: {
    backgroundColor: '#E63946',
    color: '#fff',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
    marginTop: '20px',
  },
}

export default Sidebar
