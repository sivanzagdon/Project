import React from 'react'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import './RequestsByWeekdayChart.css'

interface Props {
  site: string
  data: { weekday: string; count: number }[]
  title?: string
}

// Chart component that displays service request distribution by weekday with gradient bars
const RequestsByWeekdayChart: React.FC<Props> = ({ site, data, title }) => {
  const weekdayMap: Record<string, string> = {
    Sunday: 'Sun',
    Monday: 'Mon',
    Tuesday: 'Tue',
    Wednesday: 'Wed',
    Thursday: 'Thu',
    Friday: 'Fri',
    Saturday: 'Sat',
  }

  const weekdayOrder = Object.keys(weekdayMap)

  const orderedData = weekdayOrder.map((day) => {
    const found = data.find((d) => d.weekday === day)
    return {
      weekday: weekdayMap[day],
      count: found?.count || 0,
    }
  })

  return (
    <div className="card">
      <h2 className="title">{title || `${site} Requests by Weekday`}</h2>
      <ResponsiveContainer width="100%" height={550}>
        <BarChart data={orderedData} barCategoryGap={0} barGap={0}>
          <XAxis dataKey="weekday" interval={0} tick={{ fontSize: '14' }} />
          <YAxis width={60} />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="url(#gradient)"
            radius={[6, 6, 0, 0]}
            barSize={30}
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" stopOpacity={1} />
              <stop offset="100%" stopColor="#e0e7ff" stopOpacity={1} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RequestsByWeekdayChart
