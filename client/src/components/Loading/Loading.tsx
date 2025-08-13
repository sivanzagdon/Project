import React from 'react'
import './Loading.css'

interface LoadingProps {
  message?: string
}

const Loading: React.FC<LoadingProps> = ({ message = '' }) => {
  return (
    <div className="loading-container">
      <div className="loading-content">
        <div className="loading-spinner"></div>
        {message !== '' && <p className="loading-message">{message}</p>}
      </div>
    </div>
  )
}

export default Loading