import { get } from './axios.service'

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

export interface DashboardData {
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

interface TimeData {
  created_at: string | null
  closed_at: string | null
}

export interface TimeDataList {
  A: TimeData[]
  B: TimeData[]
  C: TimeData[]
}

export class DashboardService {
  getDashboardData = async (): Promise<DashboardData> => {
    const response = await get('/api/dashboard')
    console.log(response.data)
    return response.data
  }

  getTimeData = async (): Promise<TimeDataList> => {
    const response = await get('/api/time-data')
    console.log('First 5 rows of data:', response.data)
    return response.data
  }
}
