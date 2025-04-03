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

// export interface GroupedSubCategories {
//   Cleaning: SubCategoryCount[]
//   Maintenance: SubCategoryCount[]
//   IT_and_Connectivity: SubCategoryCount[]
//   Access_and_Security: SubCategoryCount[]
//   Furniture_and_Facilities: SubCategoryCount[]
//   Events_and_Community: SubCategoryCount[]
//   Utilities: SubCategoryCount[]
//   Other: SubCategoryCount[]
// }

export interface GroupedSubCategorySummary {
  group: string
  count: number
  subcategories: string[]
}

export class DashboardService {
  getDashboardData = async (): Promise<DashboardData> => {
    const response = await get('/api/dashboard')
    console.log(response.data)
    return response.data
  }

  // handleSubCategoies = async (
  //   sub_category: SubCategoryCount[]
  // ): Promise<GroupedSubCategories> => {
  //   const grouped: GroupedSubCategories = {
  //     Cleaning: [],
  //     Maintenance: [],
  //     IT_and_Connectivity: [],
  //     Access_and_Security: [],
  //     Furniture_and_Facilities: [],
  //     Events_and_Community: [],
  //     Utilities: [],
  //     Other: [],
  //   }

  //   sub_category.forEach((item) => {
  //     const name = item.subcategory.toLowerCase()

  //     if (
  //       name.includes('clean') ||
  //       name.includes('restroom') ||
  //       name.includes('toilet') ||
  //       name.includes('pest control') ||
  //       name.includes('extra cleaning')
  //     ) {
  //       grouped.Cleaning.push(item)
  //     } else if (
  //       name.includes('repair') ||
  //       name.includes('fix') ||
  //       name.includes('leak') ||
  //       name.includes('broken') ||
  //       name.includes('maintenance') ||
  //       name.includes('damage') ||
  //       name.includes('paint') ||
  //       name.includes('installation') ||
  //       name.includes('window does not') ||
  //       name.includes('door does not') ||
  //       name.includes('floor is') ||
  //       name.includes('signage') ||
  //       name.includes('garden') ||
  //       name.includes('terrace') ||
  //       name.includes('weeds') ||
  //       name.includes('graffiti') ||
  //       name.includes('clogged') ||
  //       name.includes('elevator does not')
  //     ) {
  //       grouped.Maintenance.push(item)
  //     } else if (
  //       name.includes('wifi') ||
  //       name.includes('internet') ||
  //       name.includes('it') ||
  //       name.includes('av') ||
  //       name.includes('screen') ||
  //       name.includes('port') ||
  //       name.includes('mindspace app') ||
  //       name.includes('marketing screen')
  //     ) {
  //       grouped.IT_and_Connectivity.push(item)
  //     } else if (
  //       name.includes('access') ||
  //       name.includes('key') ||
  //       name.includes('card') ||
  //       name.includes('tag') ||
  //       name.includes('lock') ||
  //       name.includes('security') ||
  //       name.includes('intercom') ||
  //       name.includes('fire alarm') ||
  //       name.includes('cctv')
  //     ) {
  //       grouped.Access_and_Security.push(item)
  //     } else if (
  //       name.includes('furniture') ||
  //       name.includes('equipment') ||
  //       name.includes('printer') ||
  //       name.includes('dishwasher') ||
  //       name.includes('fridge') ||
  //       name.includes('coffee machine') ||
  //       name.includes('supplies') ||
  //       name.includes('replacing stock') ||
  //       name.includes('packages') ||
  //       name.includes('mail') ||
  //       name.includes('logo request')
  //     ) {
  //       grouped.Furniture_and_Facilities.push(item)
  //     } else if (
  //       name.includes('event') ||
  //       name.includes('host') ||
  //       name.includes('community') ||
  //       name.includes('arrange') ||
  //       name.includes('booking') ||
  //       name.includes('meeting') ||
  //       name.includes('guests')
  //     ) {
  //       grouped.Events_and_Community.push(item)
  //     } else if (
  //       name.includes('power') ||
  //       name.includes('electricity') ||
  //       name.includes('light') ||
  //       name.includes('air conditioner') ||
  //       name.includes('heating') ||
  //       name.includes('ventilation') ||
  //       name.includes('water') ||
  //       name.includes('outage') ||
  //       name.includes('socket')
  //     ) {
  //       grouped.Utilities.push(item)
  //     } else {
  //       grouped.Other.push(item)
  //     }
  //   })

  //   return grouped
  // }

  // summarizeGroupedSubCategories = async (
  //   sub_category: SubCategoryCount[]
  // ): Promise<GroupedSubCategorySummary[]> => {
  //   const grouped = await this.handleSubCategoies(sub_category)
  //   return Object.entries(grouped).map(([group, items]) => ({
  //     group,
  //     count: items.reduce(
  //       (sum: number, item: SubCategoryCount) => sum + item.count,
  //       0
  //     ),
  //     subcategories: items.map((item: SubCategoryCount) => item.subcategory),
  //   }))
  // }
}
