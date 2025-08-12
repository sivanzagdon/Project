import React from 'react'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

interface Props {
  site: string
  data: { weekday: string; count: number }[]
  title?: string
}

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
    <div style={styles.card}>
      <h2 style={styles.title}>{title || `${site} Requests by Weekday`}</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={orderedData} barCategoryGap={0} barGap={0}>
          <XAxis dataKey="weekday" interval={0} tick={{ fontSize: '14' }} />
          <YAxis />
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

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
    padding: '24px',
    marginTop: '2rem',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    width: '100%',
    minWidth: '480px',
    flex: 1,
  },
  title: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '18px',
    fontWeight: 500,
    letterSpacing: '0.25px',
    color: '#111827',
  },
}

export default RequestsByWeekdayChart
