import React, { useState, useEffect, useCallback } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../../redux/slices/userSlice'
import { RootState } from '../../redux/store'
import HomeIcon from '@mui/icons-material/Home'
import ListAltIcon from '@mui/icons-material/ListAlt'
import SettingsIcon from '@mui/icons-material/Settings'
import LogoutIcon from '@mui/icons-material/Logout'
import AddIcon from '@mui/icons-material/Add'
import MenuIcon from '@mui/icons-material/Menu'
import PersonIcon from '@mui/icons-material/Person'
import BusinessIcon from '@mui/icons-material/Business'
import WorkIcon from '@mui/icons-material/Work'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import EventIcon from '@mui/icons-material/Event'
import './Sidebar.css'

// Sidebar navigation component with collapsible functionality and user profile integration
const Sidebar: React.FC = () => {
  const dispatch = useDispatch()
  const location = useLocation()
  const navigate = useNavigate()
  const [activeItem, setActiveItem] = useState(location.pathname)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  
  // User state
  const userState = useSelector((state: RootState) => state.user)
  const empId = userState.empID
  const [userProfile, setUserProfile] = useState<any>(null)

  useEffect(() => {
    setActiveItem(location.pathname)
  }, [location.pathname])

  // Load user profile data only when empId changes
  useEffect(() => {
    if (empId) {
      loadUserProfile()
    }
  }, [empId])

  // Loads user profile data from the backend API
  const loadUserProfile = useCallback(async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/get-user-preferences?empId=${empId}`)
      if (response.ok) {
        const profile = await response.json()
        setUserProfile(profile)
      }
    } catch (error) {
      // Silent error handling for better performance
    }
  }, [empId])

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

  // Debug logging
  useEffect(() => {
    console.log('Sidebar - isSidebarOpen:', isSidebarOpen)
    console.log('Sidebar - activeItem:', activeItem)
    console.log('Sidebar - userState:', userState)
  }, [isSidebarOpen, activeItem, userState])

  // Handles user logout by clearing Redux state and redirecting to login page
  const handleLogout = useCallback(() => {
    dispatch(logout())
    localStorage.removeItem('persist:root')
    window.location.href = '/login'
  }, [dispatch])

  // Handles navigation item clicks and updates active state
  const handleItemClick = useCallback((path: string) => {
    setActiveItem(path)
    navigate(path)
    // Remove the setTimeout hack - it's causing performance issues
  }, [navigate])

  // Opens the sidebar by setting the sidebar state to visible
  const openSidebar = useCallback(() => {
    setIsSidebarOpen(true)
  }, [])

  // Closes the sidebar by setting the sidebar state to hidden
  const closeSidebar = useCallback(() => {
    setIsSidebarOpen(false)
  }, [])

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
            <li
              className="mini-menu-item profile-item"
              onClick={() => navigate('/settings')}
              title="User Profile"
            >
              <PersonIcon className="mini-icon" />
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
          <div className="logo-text sidebar-header">SLAware</div>
          <div className="logo-subtitle sidebar-subtitle">AI powered SLA management</div>
        </div>

        <ul className="menu">
          <li
            className={`menu-item nav-item ${activeItem === '/home' ? 'active' : ''}`}
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
            className={`menu-item nav-item ${activeItem === '/profile' ? 'active' : ''}`}
            onClick={() => handleItemClick('/profile')}
          >
            <PersonIcon className="icon" />
            <Link to="/profile" className="link">
              Profile
            </Link>
          </li>
          <li
            className={`menu-item nav-item ${activeItem === '/new-ticket' ? 'active' : ''}`}
            onClick={() => handleItemClick('/new-ticket')}
          >
            <AddIcon className="icon" />
            <Link to="/new-ticket" className="link">
              New Request
            </Link>
          </li>
          <li
            className={`menu-item nav-item ${activeItem === '/open-requests' ? 'active' : ''}`}
            onClick={() => handleItemClick('/open-requests')}
          >
            <ListAltIcon className="icon" />
            <Link to="/open-requests" className="link">
              Open Requests
            </Link>
          </li>
          <li
            className={`menu-item nav-item ${activeItem === '/settings' ? 'active' : ''}`}
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