import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface CategoryData {
  category: string
  count: number
}

export interface SubCategoryData {
  subcategory: string
  count: number
}

export interface WeekdayData {
  weekday: string
  count: number
}

export interface CombinedRateData {
  date: string
  opening_rate: number
  closing_rate: number
}

export interface TimeDataList {
  A: CombinedRateData[]
  B: CombinedRateData[]
  C: CombinedRateData[]
}

export interface DashboardInterface {
  A: {
    main_category: CategoryData[]
    sub_category: SubCategoryData[]
    by_weekday: WeekdayData[]
  }
  B: {
    main_category: CategoryData[]
    sub_category: SubCategoryData[]
    by_weekday: WeekdayData[]
  }
  C: {
    main_category: CategoryData[]
    sub_category: SubCategoryData[]
    by_weekday: WeekdayData[]
  }
}

interface DashboardState {
  data: DashboardInterface | null
  dataTimes: any // Keep raw data from API
  lastFetched: number | null
}

const initialState: DashboardState = {
  data: null,
  dataTimes: null,
  lastFetched: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setDashboardData(state, action: PayloadAction<DashboardInterface>) {
      state.data = action.payload
      state.lastFetched = Date.now()
    },
    setTimeData(state, action: PayloadAction<any>) {
      state.dataTimes = action.payload
      state.lastFetched = Date.now()
    },
    clearDashboardData(state) {
      state.data = null
      state.dataTimes = null
      state.lastFetched = null
    },
  },
})

export const { setDashboardData, setTimeData, clearDashboardData } =
  dashboardSlice.actions
export default dashboardSlice.reducer
