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
import storage from 'redux-persist/lib/storage' // localStorage / AsyncStorage
import rootReducer from './slices/index'

const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['user'],
}

const persistedReducer = persistReducer(persistConfig, rootReducer)

// יצירת ה-store עם Redux Persist
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER], // התעלמות מכמה פעולות שמבצע Redux Persist
      },
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
