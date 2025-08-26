import React, { useEffect, useState, useMemo, useCallback } from 'react'
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

// Main dashboard screen component that displays analytics charts and insights with site and year filtering
const DashboardPage: React.FC = () => {
  const dispatch = useDispatch()
  const data = useSelector((state: RootState) => state.dashboard.data)
  const timeData = useSelector((state: RootState) => state.dashboard.dataTimes)
  const lastFetching = useSelector(
    (state: RootState) => state.dashboard.lastFetched
  )

  const [selectedBuilding, setSelectedBuilding] = useState<'A' | 'B' | 'C'>('A')
  const [selectedYear, setSelectedYear] = useState<'2023' | '2024'>('2024')
  const [calculatedTimeData, setCalculatedTimeData] = useState<any>(null)
  const [combinedRateData, setCombinedRateData] = useState({
    A: [],
    B: [],
    C: [],
  })

  // Handles building/site selection changes and updates the selected building state
  const handleBuildingChange = useCallback((building: 'A' | 'B' | 'C') => {
    setSelectedBuilding(building)
  }, [])

  // Handles year selection changes and updates the selected year state
  const handleYearChange = useCallback((year: '2023' | '2024') => {
    setSelectedYear(year)
  }, [])

  // Fetch dashboard data only once
  useEffect(() => {
    if (!data) {
      dashboardService
        .getDashboardData()
        .then((res) => dispatch(setDashboardData(res)))
    }
  }, [dispatch, data])

  // Fetch time data with caching
  useEffect(() => {
    const currentTime = Date.now()
    const shouldFetch = !timeData || currentTime - (lastFetching || 0) > 10 * 60 * 1000
    
    if (shouldFetch) {
      dashboardService.getTimeData().then((res) => {
        dispatch(setTimeData(res))
      })
    }
  }, [dispatch, timeData, lastFetching])

  // Calculate rates only when timeData or building changes
  useEffect(() => {
    if (timeData) {
      calculateOpeningAndClosingRates(
        timeData,
        selectedBuilding,
        setCalculatedTimeData,
        createCombinedData,
        setCombinedRateData
      )
    }
  }, [timeData, selectedBuilding])

  // Memoize site data to prevent unnecessary recalculations
  const siteData = useMemo(() => {
    if (!data || !data[selectedBuilding] || !data[selectedBuilding][selectedYear]) {
      return null
    }
    return data[selectedBuilding][selectedYear]
  }, [data, selectedBuilding, selectedYear])

  // Memoize rates data
  const rates = useMemo(() => {
    return combinedRateData[selectedBuilding] || []
  }, [combinedRateData, selectedBuilding])

  // Memoize main category charts
  const mainCategoryCharts = useMemo(() => {
    if (!siteData) return []
    
    const charts: React.ReactNode[] = []
    
    // Yearly chart
    charts.push(
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

    // Monthly charts
    Object.entries(siteData.monthly).forEach(([monthName, monthlyData]) => {
      charts.push(
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
    
    return charts
  }, [siteData, selectedBuilding])

  // Memoize weekday charts
  const weekdayCharts = useMemo(() => {
    if (!siteData) return []
    
    const charts: React.ReactNode[] = []
    
    // Yearly chart
    charts.push(
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

    // Monthly charts
    Object.entries(siteData.monthly).forEach(([monthName, monthlyData]) => {
      charts.push(
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
    
    return charts
  }, [siteData, selectedBuilding])

  // Memoize sub category charts
  const subCategoryCharts = useMemo(() => {
    if (!siteData) return []
    
    const charts: React.ReactNode[] = []
    
    // Yearly chart
    charts.push(
      <SubCategoryChart
        key="yearly-sub"
        site={selectedBuilding}
        data={siteData.yearly.sub_category}
        title={`${selectedBuilding} - Yearly SubCategory`}
        color="6366f1"
      />
    )

    // Monthly charts
    Object.entries(siteData.monthly).forEach(([monthName, monthlyData]) => {
      charts.push(
        <SubCategoryChart
          key={`sub-${monthName}`}
          site={selectedBuilding}
          data={monthlyData.sub_category}
          title={`${selectedBuilding} - ${monthName} SubCategory`}
          color="6366f1"
        />
      )
    })
    
    return charts
  }, [siteData, selectedBuilding])

  if (!data || !calculatedTimeData || !combinedRateData || !siteData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', minHeight: '400px', paddingLeft: '20%' }}>
        <Loading />
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-selectors">
        <div className="dashboard-selector-item">
          <SiteSelector
            selected={selectedBuilding}
            onChange={handleBuildingChange}
          />
        </div>
        <div className="dashboard-selector-item">
          <YearSelector
            selectedYear={selectedYear}
            onChange={handleYearChange}
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