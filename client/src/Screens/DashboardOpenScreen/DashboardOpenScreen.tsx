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
      const shouldFetch = !openRequestsData || !lastFetched || currentTime - lastFetched > 10 * 60 * 1000

      if (shouldFetch) {
        try {
          setLoading(true)
          setError('')
          const response = await dashboardService.getOpenRequestsDashboardData()
          dispatch(setOpenRequestsData(response))
        } catch (error) {
          console.error('Error fetching open requests data:', error)
          setError('Failed to fetch open requests data')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchOpenRequestsData()
  }, [dispatch, lastFetched, openRequestsData])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', minHeight: '400px', paddingLeft: '20%' }}>
        <Loading />
      </div>
    )
  }

  if (error) {
    return (
      <div className="dashboard-container">
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: '#ef4444', fontSize: '18px', marginBottom: '1rem' }}>❌ {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // If no data is available, show loading or empty state
  if (!openRequestsData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', minHeight: '400px', paddingLeft: '20%' }}>
        <Loading />
      </div>
    )
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
        {siteDataForSelectedSite && numOfRequestsForSelectedSite > 0 ? (
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
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '3rem', 
            color: '#64748b',
            fontSize: '18px'
          }}>
            <p>📊 No open requests data available for {selectedSite}</p>
            <p style={{ fontSize: '14px', marginTop: '0.5rem' }}>
              Try refreshing the page or selecting a different site
            </p>
          </div>
        )}
      </div>
    </>
  )
}

export default DashboardOpenRequests
