import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LoginResponse, userService } from '../../services/user.service'
import { RootState } from '../../redux/store'
import { login } from '../../redux/slices/userSlice'
import Loading from '../../components/Loading'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const LoginScreen: React.FC = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [empId, setEmpId] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const userState = useSelector((state: RootState) => state.user)

  useEffect(() => {
    console.log('User State changed:', userState)
  }, [userState])

  const handleLogin = async () => {
    if (!empId || !password) {
      alert('Please enter both Employee ID and Password.')
      return
    }

    const empIdNumber = parseInt(empId, 10)
    if (isNaN(empIdNumber)) {
      alert('Employee ID must be a valid number.')
      return
    }

    setIsLoading(true)

    try {
      const response: LoginResponse = await userService.login(
        empIdNumber,
        password
      )

      dispatch(login(response))
      navigate('/home')
      alert('You have successfully logged in.')
    } catch (error: any) {
      alert('Login Failed: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <img src="/logo.png" alt="Logo" style={styles.logo} />

      <h1 style={styles.title}>ColmaNalyze</h1>
      <h2 style={styles.title}>Smarter Insights For Talent Retention</h2>

      <input
        type="text"
        style={styles.input}
        placeholder="Employee ID"
        value={empId}
        onChange={(e) => setEmpId(e.target.value)}
      />
      <input
        type="password"
        style={styles.input}
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button style={styles.button} onClick={handleLogin}>
        Sign in
      </button>

      {isLoading && <Loading message="Signing in..." />}
    </div>
  )
}

export default LoginScreen

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#F0F4F8',
  },
  logo: {
    width: '150px',
    height: '150px',
    marginBottom: '30px',
  },
  title: {
    fontSize: '30px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '21px',
  },
  input: {
    width: '80%',
    padding: '15px',
    margin: '10px 0',
    backgroundColor: '#F7F7F7',
    borderRadius: '10px',
    color: '#333',
    fontSize: '16px',
    border: '1px solid #DDD',
  },
  button: {
    backgroundColor: '#4A90E2',
    borderRadius: '10px',
    padding: '16px 60px',
    margin: '20px 0',
    color: '#FFFFFF',
    fontSize: '18px',
    fontWeight: 600,
    letterSpacing: '0.8px',
    cursor: 'pointer',
    border: 'none',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
}
