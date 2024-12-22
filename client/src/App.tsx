import { useEffect } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './redux/store'
import Loading from './components/Loading'
import LoginScreen from './Screens/LoginScreen/LoginScreen'
import React from 'react'

const App: React.FC = () => {
  useEffect(() => {
    const logPersistedStorage = () => {
      try {
        const storedData = localStorage.getItem('persist:root') // קריאה מה-localStorage
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

  return (
    <Provider store={store}>
      <PersistGate loading={<Loading />} persistor={persistor}>
        <LoginScreen />
      </PersistGate>
    </Provider>
  )
}

export default App
