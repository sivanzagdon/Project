import React from 'react'

interface LoadingProps {
  message?: string
}

const Loading: React.FC<LoadingProps> = ({ message = '' }) => {
  return (
    <div style={styles.container}>
      <div style={styles.content}>
        <div style={styles.spinner}></div>
        {message !== '' && <p style={styles.message}>{message}</p>}
      </div>
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: '#ffffff',
    padding: '20px',
    borderRadius: '12px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #ddd',
    borderTop: '4px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  message: {
    marginTop: '12px',
    fontSize: '16px',
    color: '#333',
    fontWeight: 500,
    textAlign: 'center',
  },
}

const styleTag = document.createElement('style')
styleTag.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`
document.head.appendChild(styleTag)

export default Loading
