import React from 'react'
import './MainCategoryChart.css'
import BarChartComponent from './BarChartComponent'

interface Props {
  site: string
  data: { category: string; count: number; date?: string }[]
  title?: string
  color?: string
}

const MainCategoryChart: React.FC<Props> = ({
  site,
  data,
  title,
  color = '#6366f1',
}) => {
  return (
    <div className="card">
      <h2 className="title">{title || `${site} Main Category Breakdown`}</h2>
      <BarChartComponent data={data} color={color} />
    </div>
  )
}

export default MainCategoryChart
