import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import {
  getDashboardData,
  DashboardData,
} from '../../services/dashboard.service'
import Loading from '../../components/Loading'

const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardData | null>(null)

  useEffect(() => {
    getDashboardData().then(setData).catch(console.error)
  }, [])

  if (!data) return <Loading />

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Main Category Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.main_category}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>

      <h2 style={{ marginTop: '3rem' }}>SubCategory Breakdown</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data.sub_category}>
          <XAxis dataKey="subcategory" />
          <YAxis />
          <Tooltip />
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
