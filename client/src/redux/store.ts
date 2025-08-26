import { configureStore } from '@reduxjs/toolkit'
import {
  persistReducer,
  persistStore,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import rootReducer from './slices/index'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user'], // Only persist user data
}

// Creates persisted reducer with localStorage for user authentication state
const persistedReducer = persistReducer(persistConfig, rootReducer)

// Configures Redux store with persistence middleware and development tools
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
})

// Creates persistor for handling Redux state persistence with localStorage
export const persistor = persistStore(store, null, () => {
  console.log('PersistGate - Rehydration completed')
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
