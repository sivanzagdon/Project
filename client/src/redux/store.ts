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

// הגדרת הקונפיגורציה של Redux Persist
const persistConfig = {
  key: 'root', // מפתח שמייצג את האחסון
  version: 1, // גרסה
  storage, // אחסון ב-localStorage או ב-AsyncStorage
  whitelist: ['user'], // רשימה של reducers שברצונך לשמור
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

// יצירת persistor כדי לאחסן את המידע בצורה נכונה
export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
