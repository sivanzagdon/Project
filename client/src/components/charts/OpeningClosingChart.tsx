import React from 'react'
import MonthlyChart from './MonthlyChart'
import ChartCarousel from './ChartCarousel'
import AiInsights from '../insights/OpeningClosingAiInsights'

interface Props {
  site: string
  data: { date: string; opening_rate: number; closing_rate: number }[]
  year: number
}

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const OpeningClosingChart: React.FC<Props> = ({ site, data, year }) => {
  const filteredData = data.filter(
    (item) => new Date(item.date).getFullYear() === year
  )

  const dataByMonth = filteredData.reduce((acc, item) => {
    const month = new Date(item.date).getMonth()
    if (!acc[month]) acc[month] = []
    acc[month].push(item)
    return acc
  }, {} as Record<number, typeof data>)

  const monthlyCharts: React.ReactNode[] = Object.entries(dataByMonth).map(
    ([monthIndex, monthData]) => {
      const monthName = monthNames[parseInt(monthIndex)]
      return (
        <div key={monthIndex}>
          <MonthlyChart monthName={monthName} data={monthData} />
          <AiInsights
            site={site as 'A' | 'B' | 'C'}
            year={year}
            month={monthName}
            combinedData={monthData}
          />
        </div>
      )
    }
  )

  return (
    <div style={styles.card}>
      <h2 style={styles.title}>{`${site} Opening & Closing Rates by Month`}</h2>
      <div style={styles.legendContainer}>
        <div style={styles.legendItem}>
          <span style={{ ...styles.outerDot, backgroundColor: '#e0e7ff' }}>
            <span style={{ ...styles.innerDot, backgroundColor: '#6366f1' }} />
          </span>
          <span style={styles.legendText}>Opening Rate</span>
        </div>
        <div style={styles.legendItem}>
          <span style={{ ...styles.outerDot, backgroundColor: '#ede9fe' }}>
            <span style={{ ...styles.innerDot, backgroundColor: '#6b7280' }} />
          </span>
          <span style={styles.legendText}>Closing Rate</span>
        </div>
      </div>

      <ChartCarousel charts={monthlyCharts} />
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    padding: '24px',
    marginTop: '2rem',
    width: '100%',
    maxWidth: '1800px',
  },
  title: {
    fontFamily: 'Inter, sans-serif',
    fontSize: '18px',
    fontWeight: 500,
    letterSpacing: '0.25px',
    color: '#111827',
  },
  legendContainer: {
    display: 'flex',
    gap: '2rem',
    alignItems: 'center',
    marginBottom: '1.5rem',
    marginLeft: '0.5rem',
  },
  legendItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem',
  },
  outerDot: {
    width: '14px',
    height: '14px',
    borderRadius: '50%',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerDot: {
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  },
  legendText: {
    fontSize: '0.95rem',
    color: '#111827',
  },
}

export default OpeningClosingChart
