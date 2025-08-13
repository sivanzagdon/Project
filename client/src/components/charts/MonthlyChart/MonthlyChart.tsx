import React from 'react'
import './MonthlyChart.css'
import LineAreaChart from './LineAreaChart'

interface Props {
  data: { date: string; opening_rate: number; closing_rate: number }[]
  monthName: string
}

const MonthlyChart: React.FC<Props> = ({ data, monthName }) => {
  return (
    <div className="chart-container">
      <h4 className="chart-title">{monthName}</h4>
      <div className="chart-wrapper">
        <LineAreaChart data={data} />
      </div>
    </div>
  )
}

export default MonthlyChart
