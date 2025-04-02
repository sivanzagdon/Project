import { combineReducers } from '@reduxjs/toolkit'
import userReducer from './userSlice'
import dashboardSlice from './dashboardSlice'

const rootReducer = combineReducers({
  user: userReducer,
  dashboard: dashboardSlice,
})

export default rootReducer
