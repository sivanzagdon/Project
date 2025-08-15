import React, { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { logout } from '../../redux/slices/userSlice'
import HomeIcon from '@mui/icons-material/Home'
import ListAltIcon from '@mui/icons-material/ListAlt'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import AddIcon from '@mui/icons-material/Add'
import MenuIcon from '@mui/icons-material/Menu'
import './Sidebar.css'

const Sidebar: React.FC = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [activeItem, setActiveItem] = useState(location.pathname)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  useEffect(() => {
    setActiveItem(location.pathname)
  }, [location.pathname])

  useEffect(() => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      if (isSidebarOpen) {
        mainContent.classList.remove('sidebar-hidden');
      } else {
        mainContent.classList.add('sidebar-hidden');
      }
    }
  }, [isSidebarOpen]);

  const handleLogout = () => {
    dispatch(logout())
    localStorage.removeItem('persist:root')
    window.location.href = '/login'
  }

  const handleItemClick = (path: string) => {
    setActiveItem(path)
    navigate(path)
    setTimeout(() => {
      if (location.pathname !== path) {
        window.location.href = path
      }
    }, 100)
  }

  const openSidebar = () => {
    setIsSidebarOpen(true)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <>
      {!isSidebarOpen && (
        <div className="mini-sidebar">
          <div className="mini-toggle-wrapper">
            <button onClick={openSidebar} className="mini-toggle-button">
              <MenuIcon />
            </button>
          </div>

          <ul className="mini-menu">
            <li
              className={`mini-menu-item ${activeItem === '/home' ? 'active' : ''}`}
              onClick={() => handleItemClick('/home')}
              title="Dashboard"
            >
              <HomeIcon className="mini-icon" />
            </li>
            <li
              className={`mini-menu-item ${activeItem === '/new-ticket' ? 'active' : ''}`}
              onClick={() => handleItemClick('/new-ticket')}
              title="New Request"
            >
              <AddIcon className="mini-icon" />
            </li>
            <li
              className={`mini-menu-item ${activeItem === '/open-requests' ? 'active' : ''}`}
              onClick={() => handleItemClick('/open-requests')}
              title="Open Requests"
            >
              <ListAltIcon className="mini-icon" />
            </li>
            <li
              className={`mini-menu-item ${activeItem === '/settings' ? 'active' : ''}`}
              onClick={() => handleItemClick('/settings')}
              title="Settings"
            >
              <SettingsIcon className="mini-icon" />
            </li>
          </ul>

          <div className="mini-logout-wrapper">
            <div className="mini-menu-item logout-item" onClick={handleLogout} title="Logout">
              <LogoutIcon className="mini-icon" />
            </div>
          </div>
        </div>
      )}

      <div className={`sidebar ${!isSidebarOpen ? 'hidden' : ''}`}>
        {isSidebarOpen && (
          <div className="toggle-button-wrapper">
            <button onClick={closeSidebar} className="icon-button">
              <MenuIcon />
            </button>
          </div>
        )}

        <div className="logo-wrapper">
          <img src="/logo.svg" alt="Logo" className="logo" />
          <div className="logo-text">SLAware</div>
          <div className="logo-subtitle">AI powered SLA management</div>
        </div>

        <ul className="menu">
          <li
            className={`menu-item ${activeItem === '/home' ? 'active' : ''}`}
            onClick={() => handleItemClick('/home')}
          >
            <HomeIcon className="icon" />
            <Link
              to="/home"
              className="link"
              onClick={(e) => {
                e.preventDefault()
                handleItemClick('/home')
              }}
            >
              Dashboard
            </Link>
          </li>
          <li
            className={`menu-item ${activeItem === '/new-ticket' ? 'active' : ''}`}
            onClick={() => handleItemClick('/new-ticket')}
          >
            <AddIcon className="icon" />
            <Link to="/new-ticket" className="link">
              New Request
            </Link>
          </li>
          <li
            className={`menu-item ${activeItem === '/open-requests' ? 'active' : ''}`}
            onClick={() => handleItemClick('/open-requests')}
          >
            <ListAltIcon className="icon" />
            <Link to="/open-requests" className="link">
              Open Requests
            </Link>
          </li>
          <li
            className={`menu-item ${activeItem === '/settings' ? 'active' : ''}`}
            onClick={() => handleItemClick('/settings')}
          >
            <SettingsIcon className="icon" />
            <Link to="/settings" className="link">
              Settings
            </Link>
          </li>
          <li className="menu-item logout-item">
            <LogoutIcon className="icon" />
            <button className="logout-button" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </div>
    </>
  )
}

export default Sidebar