// SubCategoryChart.tsx
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
  data: { subcategory: string; count: number }[]
  title?: string
  color: string // תכונה חדשה לצבע
}

const SubCategoryChart: React.FC<Props> = ({ site, data, title, color }) => {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{title || `${site} SubCategory Breakdown`}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} barCategoryGap={0} barGap={0}>
          <XAxis dataKey="subcategory" interval={0} tick={false} />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="count"
            fill={`url(#gradient)`} // שימוש בצבע מהפרופס
            radius={[6, 6, 0, 0]}
            barSize={16}
          />
          <defs>
            <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity={1} />{' '}
              {/* White color at start */}
              <stop offset="100%" stopColor={color} stopOpacity={1} />{' '}
              {/* Use the passed color */}
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

export default SubCategoryChart
