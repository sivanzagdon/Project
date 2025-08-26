import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { setOpenRequestsData } from '../../redux/slices/dashboardSlice'
import OpenRequestsCount from '../../components/charts-openRequest/OpenRequestsCount'
import MainCategoryChart from '../../components/charts/MainCategoryChart/MainCategoryChart'
import SubCategoryChart from '../../components/charts/SubCategoryChart/SubCategoryChart'
import RequestsByWeekdayChart from '../../components/charts/RequestsByWeekdayChart/RequestsByWeekdayChart'
import SiteSelector from '../../components/charts/SiteSelector'
import { DashboardService } from '../../services/dashboard.service'
import Loading from '../../components/Loading/Loading'
import './DashboardOpenRequests.style.css'

const dashboardService = new DashboardService()

// Dashboard screen component that displays analytics for open service requests with site filtering
const DashboardOpenRequests: React.FC = () => {
  const dispatch = useDispatch()
  const { openRequestsData } = useSelector(
    (state: RootState) => state.dashboard
  )
  const lastFetched = useSelector(
    (state: RootState) => state.dashboard.lastFetched
  )
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [selectedSite, setSelectedSite] = useState<'A' | 'B' | 'C'>('A')

  // Fetches open requests dashboard data with caching to avoid unnecessary API calls
  useEffect(() => {
    const fetchOpenRequestsData = async () => {
      const currentTime = Date.now()

      if (!lastFetched || currentTime - lastFetched > 10 * 60 * 1000) {
        try {
          setLoading(true)
          const response = await dashboardService.getOpenRequestsDashboardData()
          dispatch(setOpenRequestsData(response))
        } catch (error) {
          setError('Failed to fetch open requests data')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchOpenRequestsData()
  }, [dispatch, lastFetched])

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <p>{error}</p>
  }

  const siteDataForSelectedSite = openRequestsData?.[selectedSite]
  
  // Calculate the number of requests for the selected site
  const numOfRequestsForSelectedSite = siteDataForSelectedSite?.main_category?.reduce((total: number, category: { count: number }) => total + category.count, 0) || 0

  // Debug logging
  console.log('DashboardOpenRequests - openRequestsData:', openRequestsData)
  console.log('DashboardOpenRequests - selectedSite:', selectedSite)
  console.log('DashboardOpenRequests - siteDataForSelectedSite:', siteDataForSelectedSite)
  console.log('DashboardOpenRequests - numOfRequestsForSelectedSite:', numOfRequestsForSelectedSite)

  return (
    <>
      <div className="site-selector">
        <SiteSelector selected={selectedSite} onChange={setSelectedSite} />
      </div>
      <div className="dashboard-container">
        <OpenRequestsCount numOfRequests={numOfRequestsForSelectedSite} />
        {siteDataForSelectedSite && (
          <>
            <div className="chart-container">
              <MainCategoryChart
                site={selectedSite}
                data={siteDataForSelectedSite?.main_category}
                color="#B2E8F3"
                title={`${selectedSite} - Open Requests Main Category`}
              />
              <RequestsByWeekdayChart
                site={selectedSite}
                data={siteDataForSelectedSite?.by_weekday}
                title={`${selectedSite} - Open Requests by Weekday`}
              />
            </div>
            <div className="subcategory-container">
              <SubCategoryChart
                site={selectedSite}
                data={siteDataForSelectedSite?.sub_category}
                color="#FF5733"
                title={`${selectedSite} - Open Requests SubCategory`}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}

export default DashboardOpenRequests
