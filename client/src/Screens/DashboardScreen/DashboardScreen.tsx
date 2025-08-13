import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import {
  setDashboardData,
  setTimeData,
} from '../../redux/slices/dashboardSlice'
import { DashboardService } from '../../services/dashboard.service'
import Loading from '../../components/Loading/Loading'
import {
  calculateOpeningAndClosingRates,
  createCombinedData,
} from './dashboardUtils'
import SiteSelector from '../../components/charts/SiteSelector'
import YearSelector from '../../components/charts/YearSelector'

import SubCategoryChart from '../../components/charts/SubCategoryChart/SubCategoryChart'
import MainCategoryChart from '../../components/charts/MainCategoryChart/MainCategoryChart'
import RequestsByWeekdayChart from '../../components/charts/RequestsByWeekdayChart/RequestsByWeekdayChart'
import OpeningClosingChart from '../../components/charts/OpeningClosingChart/OpeningClosingChart'
import ChartCarousel from '../../components/charts/ChartCarousel/ChartCarousel'
import WeekdayInsights from '../../components/insights/WeekdayInsights/WeekdayInsights'
import './DashboardScreen.style.css'
import MainCategoryInsights from '../../components/insights/MainCategoryInsights/MainCategoryInsights'

const dashboardService = new DashboardService()

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch()
  const data = useSelector((state: RootState) => state.dashboard.data)
  const timeData = useSelector((state: RootState) => state.dashboard.dataTimes)
  const lastFetching = useSelector(
    (state: RootState) => state.dashboard.lastFetched
  )

  const [selectedBuilding, setSelectedBuilding] = useState<'A' | 'B' | 'C'>('A')
  const [selectedYear, setSelectedYear] = useState(2024)
  const [calculatedTimeData, setCalculatedTimeData] = useState<any>(null)
  const [combinedRateData, setCombinedRateData] = useState({
    A: [],
    B: [],
    C: [],
  })

  useEffect(() => {
    if (!data) {
      dashboardService
        .getDashboardData()
        .then((res) => dispatch(setDashboardData(res)))
    }
  }, [dispatch, data])

  useEffect(() => {
    const currentTime = Date.now()
    if (!timeData || currentTime - (lastFetching || 0) > 10 * 60 * 1000) {
      dashboardService.getTimeData().then((res) => {
        calculateOpeningAndClosingRates(
          res,
          selectedBuilding,
          setCalculatedTimeData,
          createCombinedData,
          setCombinedRateData
        )
        dispatch(setTimeData(res))
      })
    } else if (timeData && !calculatedTimeData) {
      calculateOpeningAndClosingRates(
        timeData,
        selectedBuilding,
        setCalculatedTimeData,
        createCombinedData,
        setCombinedRateData
      )
    }
  }, [dispatch, timeData, lastFetching, selectedBuilding, calculatedTimeData])

  useEffect(() => {
    if (calculatedTimeData) {
      createCombinedData(calculatedTimeData, setCombinedRateData)
    }
  }, [selectedBuilding, calculatedTimeData])

  if (!data || !calculatedTimeData || !combinedRateData) return <Loading />

  const siteData =
    data[selectedBuilding]?.[String(selectedYear) as '2023' | '2024']
  const rates = combinedRateData[selectedBuilding]

  //Main Category
  const mainCategoryCharts: React.ReactNode[] = []

  mainCategoryCharts.push(
    <div key="main-yearly">
      <MainCategoryChart
        site={selectedBuilding}
        data={siteData.yearly.main_category}
        title={`${selectedBuilding} - Yearly Main Category`}
      />
      <MainCategoryInsights
        site={selectedBuilding}
        data={siteData.yearly.main_category}
      />
    </div>
  )

  Object.entries(siteData.monthly).forEach(([monthName, monthlyData]) => {
    mainCategoryCharts.push(
      <div key={`main-${monthName}`}>
        <MainCategoryChart
          site={selectedBuilding}
          data={monthlyData.main_category}
          title={`${selectedBuilding} - ${monthName} Main Category`}
        />
        <MainCategoryInsights
          site={selectedBuilding}
          data={monthlyData.main_category}
        />
      </div>
    )
  })

  //weekday
  const weekdayCharts: React.ReactNode[] = []

  weekdayCharts.push(
    <div key="weekday-yearly">
      <RequestsByWeekdayChart
        site={selectedBuilding}
        data={siteData.yearly.by_weekday}
        title={`${selectedBuilding} - Yearly Weekday Requests`}
      />
      <WeekdayInsights
        site={selectedBuilding}
        data={siteData.yearly.by_weekday}
      />
    </div>
  )

  Object.entries(siteData.monthly).forEach(([monthName, monthlyData]) => {
    weekdayCharts.push(
      <div key={`weekday-${monthName}`}>
        <RequestsByWeekdayChart
          site={selectedBuilding}
          data={monthlyData.by_weekday}
          title={`${selectedBuilding} - ${monthName} Weekday Requests`}
        />
        <WeekdayInsights
          site={selectedBuilding}
          data={monthlyData.by_weekday}
        />
      </div>
    )
  })

  //sub category
  const subCategoryCharts: React.ReactNode[] = []

  subCategoryCharts.push(
    <SubCategoryChart
      key="yearly-sub"
      site={selectedBuilding}
      data={siteData.yearly.sub_category}
      title={`${selectedBuilding} - Yearly SubCategory`}
      color="6366f1"
    />
  )

  Object.entries(siteData.monthly).forEach(([monthName, monthlyData]) => {
    subCategoryCharts.push(
      <SubCategoryChart
        key={`sub-${monthName}`}
        site={selectedBuilding}
        data={monthlyData.sub_category}
        title={`${selectedBuilding} - ${monthName} SubCategory`}
        color="6366f1"
      />
    )
  })

  return (
    <div className="dashboard-container">
      <div className="dashboard-selectors">
        <div className="dashboard-selector-item">
          <SiteSelector
            selected={selectedBuilding}
            onChange={setSelectedBuilding}
          />
        </div>
        <div className="dashboard-selector-item">
          <YearSelector
            selectedYear={selectedYear}
            onChange={setSelectedYear}
          />
        </div>
      </div>

      <OpeningClosingChart
        site={selectedBuilding}
        data={rates}
        year={selectedYear}
      />

      <div className="dashboard-charts-wrapper">
        <div className="dashboard-chart-section">
          <ChartCarousel charts={mainCategoryCharts} />
        </div>
        <div className="dashboard-chart-section">
          <ChartCarousel charts={weekdayCharts} />
        </div>
      </div>

      <div className="dashboard-subcategory-section">
        <ChartCarousel charts={subCategoryCharts} />
      </div>
    </div>
  )
}

export default DashboardPage