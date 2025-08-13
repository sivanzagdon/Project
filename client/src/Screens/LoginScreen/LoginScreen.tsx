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
    <div className="container">
      <img src="/logo.svg" alt="Logo" className="logo" />

      <input
        type="text"
        className="input"
        placeholder="Employee ID"
        value={empId}
        onChange={(e) => setEmpId(e.target.value)}
      />
      <input
        type="password"
        className="input"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button className="button" onClick={handleLogin}>
        Sign in
      </button>

      {isLoading && <Loading message="Signing in..." />}
    </div>
  )
}

export default LoginScreen
