import React, { useEffect, useState } from 'react'
import './RiskReveal.css'
import { getRiskColor } from './riskUtils'

interface Props {
  riskLevel: string
  color: 'green' | 'orange' | 'red'
}

const RiskReveal: React.FC<Props> = ({ riskLevel, color }) => {
  const [showResult, setShowResult] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowResult(true), 1500)
    return () => clearTimeout(timer)
  }, [])

  const riskColor = getRiskColor(color)

  return (
    <div className="risk-container">
      <div className="risk-text-container">
        <p className="risk-text" style={{ color: riskColor }}>
          Risk Level: <strong>{riskLevel}</strong>
        </p>
        <div className="risk-check" style={{ color: riskColor }}>✔</div>
      </div>
    </div>
  )
}

export default RiskReveal
