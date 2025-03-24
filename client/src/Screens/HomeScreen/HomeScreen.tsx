import React from 'react'
import { useSelector } from 'react-redux'
import { RootState } from './../../redux/store'
import { useNavigate } from 'react-router-dom'

const HomeScreen = () => {
  const user_name = useSelector((state: RootState) => state.user.user_name)
  const navigate = useNavigate()

  const handleNewTicket = () => {
    navigate('/new-ticket')
  }

  return (
    <div style={styles.container}>
      <img src="/assets/images/logo.png" alt="Logo" style={styles.logo} />

      <h1 style={styles.title}>Hello {user_name}</h1>

      <button style={styles.button} onClick={handleNewTicket}>
        Opening a new service request
      </button>
    </div>
  )
}

export default HomeScreen

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#FFFFFF',
  },
  logo: {
    width: '150px',
    height: '150px',
    marginBottom: '30px',
    objectFit: 'contain',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '20px',
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: '10px',
    padding: '16px 60px',
    margin: '20px 0',
    color: '#FFFFFF',
    fontSize: '18px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.2)',
  },
}
