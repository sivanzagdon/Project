import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { DashboardData } from '../../types/dashboard.type'

interface DashboardState {
  data: DashboardData | null
  dataTimes: any
  openRequestsData: any
  lastFetched: number | null
}

const initialState: DashboardState = {
  data: null,
  dataTimes: null,
  openRequestsData: null,
  lastFetched: null,
}

// Redux slice for managing dashboard state including data caching and time tracking
const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    // Sets dashboard data and updates the last fetched timestamp for caching
    setDashboardData(state, action: PayloadAction<DashboardData>) {
      state.data = action.payload
      state.lastFetched = Date.now()
    },
    // Sets time-based data and updates the last fetched timestamp for caching
    setTimeData(state, action: PayloadAction<any>) {
      state.dataTimes = action.payload
      state.lastFetched = Date.now()
    },
    // Sets open requests data and updates the last fetched timestamp for caching
    setOpenRequestsData(state, action: PayloadAction<any>) {
      state.openRequestsData = action.payload
      state.lastFetched = Date.now()
    },
    // Clears all dashboard data and resets the last fetched timestamp
    clearDashboardData(state) {
      state.data = null
      state.dataTimes = null
      state.lastFetched = null
    },
  },
})

export const {
  setDashboardData,
  setTimeData,
  setOpenRequestsData,
  clearDashboardData,
} = dashboardSlice.actions
export default dashboardSlice.reducer
