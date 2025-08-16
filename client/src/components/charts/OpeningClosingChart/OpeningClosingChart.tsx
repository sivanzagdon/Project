import React from 'react'
import MonthlyChart from '../MonthlyChart/MonthlyChart'
import ChartCarousel from '../ChartCarousel/ChartCarousel'
import './OpeningClosingChart.css'
import AiInsights from '../../../components/insights/AiInsights/OpeningClosingAiInsights'

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
        <div key={monthIndex} style={{}}>
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
    <div className="card">
      <h2 className="title">{`${site} Opening & Closing Rates by Month`}</h2>
      <div className="legendContainer">
        <div className="legendItem">
          <span className="outerDot openingDot" />
          <span className="legendText">Opening Rate</span>
        </div>
        <div className="legendItem">
          <span className="outerDot closingDot" />
          <span className="legendText">Closing Rate</span>
        </div>
      </div>

      <ChartCarousel charts={monthlyCharts} />
    </div>
  )
}

export default OpeningClosingChart
