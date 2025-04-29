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

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardData(state, action: PayloadAction<DashboardData>) {
      state.data = action.payload
      state.lastFetched = Date.now()
    },
    setTimeData(state, action: PayloadAction<any>) {
      state.dataTimes = action.payload
      state.lastFetched = Date.now()
    },
    setOpenRequestsData(state, action: PayloadAction<any>) {
      state.openRequestsData = action.payload
      state.lastFetched = Date.now()
    },
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
