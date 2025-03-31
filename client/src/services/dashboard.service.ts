import { get } from './axios.service'

export interface CategoryCount {
  category: string
  count: number
}

export interface SubCategoryCount {
  subcategory: string
  count: number
}

export interface WeekdayCount {
  weekday: string
  count: number
}

export interface DashboardData {
  main_category: CategoryCount[]
  sub_category: SubCategoryCount[]
  by_weekday: WeekdayCount[]
}

export const getDashboardData = async (): Promise<DashboardData> => {
  const response = await get('/api/dashboard')
  return response.data
}
