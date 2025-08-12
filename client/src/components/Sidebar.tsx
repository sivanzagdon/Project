import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../redux/slices/userSlice'
import HomeIcon from '@mui/icons-material/Home'
import ListAltIcon from '@mui/icons-material/ListAlt'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import AddIcon from '@mui/icons-material/Add'
import MenuIcon from '@mui/icons-material/Menu'

const Sidebar: React.FC = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const [activeItem, setActiveItem] = useState(location.pathname)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('persist:root')
    window.location.href = '/login'
  }

  const handleItemClick = (path: string) => {
    setActiveItem(path)
  }

  return (
    <>
      {!isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(true)}
          style={styles.floatingToggleButton}
        >
          <MenuIcon />
        </button>
      )}

      <div
        style={{
          ...styles.sidebar,
          transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        }}
      >
        {isSidebarOpen && (
          <div style={styles.toggleButtonWrapper}>
            <button
              onClick={() => setIsSidebarOpen(false)}
              style={styles.iconButton}
            >
              <MenuIcon />
            </button>
          </div>
        )}

        <div style={styles.logoWrapper}>
          <img src="/logo.svg" alt="Logo" style={styles.logo} />
        </div>

        <h2 style={styles.title}>Menu</h2>
        <ul style={styles.menu}>
          <li
            style={{
              ...styles.menuItem,
              ...(activeItem === '/home' ? styles.activeItem : {}),
            }}
            onClick={() => handleItemClick('/home')}
          >
            <HomeIcon style={styles.icon} />
            <Link to="/home" style={styles.link}>
              Dashboard
            </Link>
          </li>
          <li
            style={{
              ...styles.menuItem,
              ...(activeItem === '/new-ticket' ? styles.activeItem : {}),
            }}
            onClick={() => handleItemClick('/new-ticket')}
          >
            <AddIcon style={styles.icon} />
            <Link to="/new-ticket" style={styles.link}>
              New Request
            </Link>
          </li>
          <li
            style={{
              ...styles.menuItem,
              ...(activeItem === '/open-requests' ? styles.activeItem : {}),
            }}
            onClick={() => handleItemClick('/open-requests')}
          >
            <ListAltIcon style={styles.icon} />
            <Link to="/open-requests" style={styles.link}>
              Open Requests
            </Link>
          </li>
          <li
            style={{
              ...styles.menuItem,
              ...(activeItem === '/settings' ? styles.activeItem : {}),
            }}
            onClick={() => handleItemClick('/settings')}
          >
            <SettingsIcon style={styles.icon} />
            <Link to="/settings" style={styles.link}>
              Settings
            </Link>
          </li>
          <li style={styles.menuItem}>
            <LogoutIcon style={styles.icon} />
            <button style={styles.logoutButton} onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}

const styles: Record<string, React.CSSProperties> = {
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '260px',
    height: '100vh',
    backgroundColor: '#f9fafb',
    color: '#111827',
    padding: '24px',
    fontFamily: 'Inter, sans-serif',
    boxSizing: 'border-box',
    borderRight: '1px solid #e5e7eb',
    transition: 'transform 0.3s ease-in-out',
    transform: 'translateX(0)',
    overflowY: 'auto',
    zIndex: 100,
    boxShadow: '2px 0 8px rgba(0,0,0,0.05)'
  },
  toggleButtonWrapper: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
  },
  floatingToggleButton: {
    position: 'fixed',
    top: 20,
    left: 20,
    zIndex: 1000,
    backgroundColor: '#ffffff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },
  iconButton: {
    backgroundColor: '#ffffff',
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
  },
  logo: {
    display: 'block',
    maxWidth: '180px',
    height: 'auto',
    objectFit: 'contain',
    margin: '0 auto 2rem',
    transform: 'scale(1.5)',
    clipPath: 'inset(10% 10% 10% 10%)',
    marginLeft: '8px',
  },
  title: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '1rem',
    color: '#111827',
  },
  menu: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
  },
  menuItem: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
    padding: '10px',
    borderRadius: '6px',
    transition: 'background-color 0.2s ease',
    cursor: 'pointer',
  },
  icon: {
    marginRight: '12px',
    color: '#6b7280',
  },
  link: {
    color: '#374151',
    textDecoration: 'none',
    fontSize: '16px',
    fontWeight: 500,
  },
  logoutButton: {
    background: 'none',
    border: 'none',
    color: '#6b7280',
    fontSize: '16px',
    fontWeight: 500,
    cursor: 'pointer',
  },
  logoWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '1rem',
    padding: 0,
  },
  activeItem: {
    backgroundColor: '#6366f1',
    color: 'white',
    borderRadius: '6px',
    padding: '10px',
  },
}

export default Sidebar
