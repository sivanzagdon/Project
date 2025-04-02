import React, { useEffect, useState } from 'react'

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

  const riskColor =
    color === 'green' ? '#28a745' : color === 'orange' ? '#fd7e14' : '#dc3545'

  return (
    <div style={styles.container}>
      {!showResult ? (
        <div className="risk-spinner" />
      ) : (
        <>
          <p style={{ ...styles.text, color: riskColor }}>
            Risk Level: <strong>{riskLevel}</strong>
          </p>
          <div style={{ ...styles.check, color: riskColor }}>✔</div>
        </>
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minHeight: '40px',
    animation: 'fadeIn 1s ease-in-out',
  },
  text: {
    fontSize: '1.1rem',
    fontWeight: 600,
  },
  check: {
    fontSize: '1.5rem',
    animation: 'pop 0.5s ease-out',
  },
}

export default RiskReveal
