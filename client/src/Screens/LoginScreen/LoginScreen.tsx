import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LoginResponse } from '../../types/user.type'
import { RootState } from '../../redux/store'
import { login } from '../../redux/slices/userSlice'
import Loading from '../../components/Loading/Loading'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { userService } from '../../services/user.service'
import './LoginScreen.style.css';

// Login screen component that handles user authentication with employee ID and password
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

  // Handles user login by validating credentials and calling the authentication service
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
    <div className="container">
      <div className="login-card">
        <img src="/logo.svg" alt="Logo" className="logo" />
        
        <h1 className="app-title">SLAware</h1>
        <p className="app-subtitle">AI powered SLA management</p>

        <div className="input-group">
          <label className="input-label">Employee ID</label>
          <input
            type="text"
            className="input"
            placeholder="Enter your Employee ID"
            value={empId}
            onChange={(e) => setEmpId(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label className="input-label">Password</label>
          <input
            type="password"
            className="input"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="button" onClick={handleLogin} disabled={isLoading}>
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>

        {isLoading && (
          <div className="loading-container">
            <Loading message="Signing in..." />
          </div>
        )}
      </div>
    </div>
  )
}

export default LoginScreen
