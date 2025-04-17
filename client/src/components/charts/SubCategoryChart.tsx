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
}

const SubCategoryChart: React.FC<Props> = ({ site, data }) => {
  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{`${site} SubCategory Breakdown`}</h2>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <XAxis dataKey="subcategory" interval={0} tick={false} />
          <YAxis />
          <Tooltip />
          <Bar
            dataKey="count"
            fill="url(#gradient)"
            radius={[6, 6, 0, 0]}
            barSize={16}
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
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)', // ← זה השינוי
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
