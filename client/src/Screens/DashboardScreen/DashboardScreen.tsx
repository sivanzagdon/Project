import React, { useEffect, useState } from 'react'
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
import {
  DashboardService,
  GroupedSubCategorySummary,
} from '../../services/dashboard.service'
import Loading from '../../components/Loading'

const dashboardService = new DashboardService()

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const { group, count, subcategories } = payload[0].payload
    return (
      <div
        style={{ background: 'white', border: '1px solid #ccc', padding: 10 }}
      >
        <strong>{group}</strong>
        <p>Count: {count}</p>
        <ul style={{ paddingLeft: '1rem' }}>
          {subcategories.map((sub: string, idx: number) => (
            <li key={idx}>{sub}</li>
          ))}
        </ul>
      </div>
    )
  }
  return null
}

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch()
  const data = useSelector((state: RootState) => state.dashboard.data)
  const [groupedSubCategorySummary, setGroupedSubCategorySummary] = useState<
    GroupedSubCategorySummary[] | null
  >(null)

  useEffect(() => {
    if (!data) {
      dashboardService
        .getDashboardData()
        .then((res) => {
          dispatch(setDashboardData(res))
          return dashboardService.summarizeGroupedSubCategories(
            res.sub_category
          )
        })
        .then(setGroupedSubCategorySummary)
        .catch(console.error)
    } else {
      dashboardService
        .summarizeGroupedSubCategories(data.sub_category)
        .then(setGroupedSubCategorySummary)
    }
  }, [dispatch, data])

  if (!data || !groupedSubCategorySummary) return <Loading />

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Main Category Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.main_category}>
          <XAxis
            dataKey="category"
            textAnchor="end"
            interval={0}
            tickFormatter={(value: string) => value.split('.')[0] + '.'}
          />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: '3rem' }}>Grouped SubCategory Summary</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={groupedSubCategorySummary}>
          <XAxis dataKey="group" interval={0} />
          <YAxis />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="count" fill="#00c49f" />
        </BarChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: '3rem' }}>Requests by Weekday</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.by_weekday}>
          <XAxis dataKey="weekday" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#ff7300" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DashboardPage
