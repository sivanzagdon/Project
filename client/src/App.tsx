import React, { useEffect } from 'react'
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
import Sidebar from './components/Sidebar/Sidebar'

const App: React.FC = () => {
  useEffect(() => {
    const logPersistedStorage = () => {
      try {
        const storedData = localStorage.getItem('persist:root')
        if (storedData) {
          console.log('Persisted Storage Data:', JSON.parse(storedData))
        } else {
          console.log('No persisted data found.')
        }
      } catch (error) {
        console.error('Error reading persisted storage:', error)
      }
    }

    logPersistedStorage()
  }, [])

  const isLoggedIn = useSelector((state: RootState) => state.user.isLoggedIn)

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <Router>
          <div style={{ display: 'flex' }}>
            {isLoggedIn && <Sidebar />}
            <div
              style={{
                marginLeft: isLoggedIn ? '200px' : '0',
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
                <Route path="/" element={<HomeScreen />} />
                <Route path="/new-ticket" element={<NewTicketForm />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/open-requests" element={<OpenRequests />} />
                {<Route path="/settings" element={<SettingsScreen />} />}
              </Routes>
            </div>
          </div>
        </Router>
      </PersistGate>
    </Provider>
  )
}

export default App
