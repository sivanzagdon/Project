// DashboardPage.tsx
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import {
  setDashboardData,
  setTimeData,
} from '../../redux/slices/dashboardSlice'
import { DashboardService } from '../../services/dashboard.service'
import Loading from '../../components/Loading'
import {
  calculateOpeningAndClosingRates,
  createCombinedData,
} from './dashboardUtils'
import SiteSelector from '../../components/charts/SiteSelector'
import YearSelector from '../../components/charts/YearSelector'

import SubCategoryChart from '../../components/charts/SubCategoryChart'
import MainCategoryChart from '../../components/charts/MainCategoryChart'
import RequestsByWeekdayChart from '../../components/charts/RequestsByWeekdayChart'
import OpeningClosingChart from '../../components/charts/OpeningClosingChart'

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

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: 'auto' }}>
      <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
        <div style={{ flex: 1 }}>
          <SiteSelector
            selected={selectedBuilding}
            onChange={setSelectedBuilding}
          />
        </div>
        <div style={{ flex: 1 }}>
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

      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <MainCategoryChart
          site={selectedBuilding}
          data={siteData.main_category}
        />
        <RequestsByWeekdayChart
          site={selectedBuilding}
          data={siteData.by_weekday}
        />
      </div>

      <SubCategoryChart site={selectedBuilding} data={siteData.sub_category} />
    </div>
  )
}

export default DashboardPage
