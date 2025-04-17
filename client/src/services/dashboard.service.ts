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
    2023: SiteYearlyData
    2024: SiteYearlyData
  }
  B: {
    2023: SiteYearlyData
    2024: SiteYearlyData
  }
  C: {
    2023: SiteYearlyData
    2024: SiteYearlyData
  }
}

export interface SiteYearlyData {
  main_category: CategoryData[]
  sub_category: SubCategoryData[]
  by_weekday: WeekdayData[]
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
    try {
      const response = await get('/api/dashboard')
      console.log('test', response.data)
      return response.data
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
      throw new Error('Failed to fetch dashboard data')
    }
  }

  getTimeData = async (): Promise<TimeDataList> => {
    try {
      const response = await get('/api/time-data')
      return response.data
    } catch (error) {
      console.error('Error fetching time data:', error)
      throw new Error('Failed to fetch time data')
    }
  }
}
