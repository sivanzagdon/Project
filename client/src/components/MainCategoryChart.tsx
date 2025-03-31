import React, { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import axios from 'axios'

const MainCategoryChart: React.FC = () => {
  const [data, setData] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/dashboard')
      .then((res) => setData(res.data))
      .catch((err) => console.error('Failed to fetch stats', err))
  }, [])

  return (
    <div>
      <h2>Main Category Breakdown</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#007bff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default MainCategoryChart
