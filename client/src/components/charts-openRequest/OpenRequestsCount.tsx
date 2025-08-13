import React, { useEffect, useState } from 'react'
import './OpenRequestsCount.css'

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
    <div className="open-requests-count-container">
      <div className="circle-wrapper">
        <div className="circle-background-gray"></div>
        <div
          className={`circle-active-green ${animate ? 'animate' : ''}`}
        ></div>

        <div className="number-container">
          <span className="num-of-requests">{formattedNumber}</span>
          <span className="subtitle">Open Requests</span>
        </div>
      </div>
    </div>
  )
}

export default OpenRequestsCount