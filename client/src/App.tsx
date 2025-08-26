import React, { memo, useEffect } from 'react'
import { Provider, useSelector } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor, RootState } from './redux/store'
import Loading from './components/Loading/Loading'
import LoginScreen from './Screens/LoginScreen/LoginScreen'
import HomeScreen from './Screens/HomeScreen/HomeScreen'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import NewTicketForm from './Screens/newTicketForm/newTicketForm'
import DashboardPage from './Screens/DashboardScreen/DashboardScreen'
import OpenRequests from './Screens/OpenRequestsScreen/OpenRequestsScreen'
import SettingsScreen from './Screens/SettingsScreen/SettingsScreen'
import ProfileScreen from './Screens/ProfileScreen/ProfileScreen'
import Sidebar from './components/Sidebar/Sidebar'
import './styles/global.css'

// Main app content component that handles routing and authentication state
const AppContent = memo(() => {
  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)
  const userState = useSelector((state: RootState) => state.user)

  // Debug logging
  useEffect(() => {
    console.log('AppContent - isLoggedIn:', isLoggedIn)
    console.log('AppContent - userState:', userState)
    console.log('AppContent - localStorage persist:', localStorage.getItem('persist:root'))
  }, [isLoggedIn, userState])

  return (
    <div style={{ display: 'flex' }}>
      {isLoggedIn && <Sidebar />}
      <div
        className="main-content"
        style={{
          marginLeft: isLoggedIn ? '280px' : '0',
          flex: 1,
          padding: '20px',
        }}
      >
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? (
                <Navigate to="/home" />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/new-ticket" element={<NewTicketForm />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/open-requests" element={<OpenRequests />} />
          <Route path="/settings" element={<SettingsScreen />} />
          <Route path="/profile" element={<ProfileScreen />} />
        </Routes>
      </div>
    </div>
  )
})

AppContent.displayName = 'AppContent'

// Root application component that provides Redux store and routing
const App: React.FC = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <Router>
          <AppContent />
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App
