import React, { useEffect, useState } from 'react'

interface Props {
  numOfRequests: number
}

const OpenRequestsCount: React.FC<Props> = ({ numOfRequests }) => {
  const [animate, setAnimate] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setAnimate(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const formattedNumber = numOfRequests.toLocaleString()

  return (
    <div style={styles.container}>
      <div style={styles.circleWrapper}>
        <div style={styles.circleBackgroundGray}></div>
        <div
          style={{
            ...styles.circleActiveGreen,
            ...(animate ? styles.animate : {}),
          }}
        ></div>

        <div style={styles.numberContainer}>
          <span style={styles.numOfRequests}>{formattedNumber}</span>
          <span style={styles.subtitle}>Open Requests</span>
        </div>
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: '250px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.05)',
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleWrapper: {
    width: '200px',
    height: '200px',
    position: 'relative',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBackgroundGray: {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    border: '12px solid #f0f0f0',
    position: 'absolute',
  },
  circleActiveGreen: {
    width: '160px',
    height: '160px',
    borderRadius: '50%',
    border: '12px solid transparent',
    borderTopColor: '##80E0E6',
    borderRightColor: '#B2E8F3',
    borderBottomColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: 'rotate(-45deg)',
    position: 'absolute',
    transition: 'all 1s ease-out',
  },
  animate: {
    transform: 'rotate(315deg)',
  },
  numberContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  numOfRequests: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '4px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#888',
  },
}

export default OpenRequestsCount
