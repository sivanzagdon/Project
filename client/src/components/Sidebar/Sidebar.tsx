import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
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

  const openSidebar = () => {
    setIsSidebarOpen(true)
  }

  const closeSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <>
      {!isSidebarOpen && (
        <button onClick={openSidebar} className="floating-toggle-button">
          <MenuIcon />
        </button>
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
        </div>

        <h2 className="title">Menu</h2>
        <ul className="menu">
          <li
            className={`menu-item ${activeItem === '/home' ? 'active' : ''}`}
            onClick={() => handleItemClick('/home')}
          >
            <HomeIcon className="icon" />
            <Link to="/home" className="link">
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
          <li className="menu-item">
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