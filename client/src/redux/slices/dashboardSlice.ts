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
  lastFetched: number | null
}

const initialState: DashboardState = {
  data: null,
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
    clearDashboardData(state) {
      state.data = null
      state.lastFetched = null
    },
  },
})

export const { setDashboardData, clearDashboardData } = dashboardSlice.actions
export default dashboardSlice.reducer
