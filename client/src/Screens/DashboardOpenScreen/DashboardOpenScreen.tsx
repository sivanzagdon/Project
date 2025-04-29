import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { setOpenRequestsData } from '../../redux/slices/dashboardSlice'
import OpenRequestsCount from '../../components/charts-openRequest/OpenRequestsCount'
import MainCategoryChart from '../../components/charts/MainCategoryChart'
import SubCategoryChart from '../../components/charts/SubCategoryChart'
import SiteSelector from '../../components/charts/SiteSelector'
import { DashboardService } from '../../services/dashboard.service'
import Loading from '../../components/Loading'

const dashboardService = new DashboardService()

const DashboardOpenRequests: React.FC = () => {
  const dispatch = useDispatch()
  const { openRequestsData } = useSelector(
    (state: RootState) => state.dashboard
  )
  const lastFetched = useSelector(
    (state: RootState) => state.dashboard.lastFetched
  )
  const [numOfRequests, setNumOfRequests] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const [selectedSite, setSelectedSite] = useState<'A' | 'B' | 'C'>('A')

  // שליפת מספר הקריאות הפתוחות
  useEffect(() => {
    const fetchNumOfRequests = async () => {
      try {
        const response = await dashboardService.getNumOfOpenRequests()
        setNumOfRequests(response)
      } catch (error) {
        setError('Failed to fetch the number of requests')
      }
    }

    fetchNumOfRequests()
  }, [])

  // שליפת נתוני הקריאות הפתוחות אם עברו יותר מ-10 דקות
  useEffect(() => {
    const fetchOpenRequestsData = async () => {
      const currentTime = Date.now()

      if (!lastFetched || currentTime - lastFetched > 10 * 60 * 1000) {
        try {
          setLoading(true)
          const response = await dashboardService.getOpenRequestsDashboadData()
          dispatch(setOpenRequestsData(response)) // עדכון סטייט ברידקס
        } catch (error) {
          setError('Failed to fetch open requests data')
        } finally {
          setLoading(false)
        }
      }
    }

    fetchOpenRequestsData()
  }, [dispatch, lastFetched]) // תלות רק ב-lastFetched

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <p>{error}</p>
  }

  const siteDataForSelectedSite = openRequestsData?.[selectedSite]

  return (
    <div
      style={{
        padding: '2rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        maxWidth: '1200px',
        margin: 'auto',
      }}
    >
      <div style={{ padding: '2rem', maxWidth: '1200px', margin: 'auto' }}>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem' }}>
          <div style={{ flex: 1 }}>
            <SiteSelector selected={selectedSite} onChange={setSelectedSite} />
          </div>
        </div>
        <OpenRequestsCount
          numOfRequests={numOfRequests} // הצגת מספר הקריאות
        />
      </div>

      {siteDataForSelectedSite && (
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            marginTop: '2rem',
          }}
        >
          <MainCategoryChart
            site={selectedSite}
            data={siteDataForSelectedSite?.main_category}
            color="#B2E8F3"
          />
          <SubCategoryChart
            site={selectedSite}
            data={siteDataForSelectedSite?.sub_category}
            color="#FF5733"
          />
        </div>
      )}
    </div>
  )
}

export default DashboardOpenRequests
