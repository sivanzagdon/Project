import React, { useEffect } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { setDashboardData } from '../../redux/slices/dashboardSlice'
import { DashboardService } from '../../services/dashboard.service'
import Loading from '../../components/Loading'

const dashboardService = new DashboardService()

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch()
  const data = useSelector((state: RootState) => state.dashboard.data)

  useEffect(() => {
    if (!data) {
      dashboardService
        .getDashboardData()
        .then((res) => {
          dispatch(setDashboardData(res))
        })
        .catch(console.error)
    }
  }, [dispatch, data])

  if (!data) return <Loading />

  const renderSiteGraphs = (site: 'A' | 'B' | 'C') => {
    const siteData = data[site]
    return (
      <>
        <h2>{`${site} Main Category Breakdown`}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={siteData.main_category}>
            <XAxis dataKey="category" textAnchor="end" interval={0} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#007bff" />
          </BarChart>
        </ResponsiveContainer>

        <h2 style={{ marginTop: '3rem' }}>{`${site} SubCategory Breakdown`}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={siteData.sub_category}>
            <XAxis dataKey="subcategory" interval={0} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#00c49f" />
          </BarChart>
        </ResponsiveContainer>

        <h2 style={{ marginTop: '3rem' }}>{`${site} Requests by Weekday`}</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={siteData.by_weekday}>
            <XAxis dataKey="weekday" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      </>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      {['A', 'B', 'C'].map((site) => renderSiteGraphs(site as 'A' | 'B' | 'C'))}
    </div>
  )
}

export default DashboardPage
