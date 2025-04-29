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
export interface SiteYearlyData {
  main_category: CategoryData[]
  sub_category: SubCategoryData[]
  by_weekday: WeekdayData[]
}

export interface SiteYearData {
  yearly: SiteYearlyData
  monthly: {
    [monthName: string]: SiteYearlyData
  }
}

export interface DashboardData {
  A: {
    2023: SiteYearData
    2024: SiteYearData
  }
  B: {
    2023: SiteYearData
    2024: SiteYearData
  }
  C: {
    2023: SiteYearData
    2024: SiteYearData
  }
}

export interface TimeData {
  created_at: string | null
  closed_at: string | null
}

export interface TimeDataList {
  A: TimeData[]
  B: TimeData[]
  C: TimeData[]
}

export interface DashboardOpenRequests {
  A: SiteYearData
  B: SiteYearData
  C: SiteYearData
}
