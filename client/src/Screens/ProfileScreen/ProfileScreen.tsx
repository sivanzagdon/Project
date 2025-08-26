import React, { useState, useEffect, useCallback, useMemo, memo } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import PersonIcon from '@mui/icons-material/Person'
import BusinessIcon from '@mui/icons-material/Business'
import WorkIcon from '@mui/icons-material/Work'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import EventIcon from '@mui/icons-material/Event'
import BadgeIcon from '@mui/icons-material/Badge'
import './ProfileScreen.css'

// Component that renders a single profile information row with icon and value
const ProfileInfoRow = memo(({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
  <div className="info-row">
    <div className="info-label">
      <Icon className="info-icon" />
      <span>{label}</span>
    </div>
    <div className="info-value">{value}</div>
  </div>
))

ProfileInfoRow.displayName = 'ProfileInfoRow'

// Loading component that displays a spinner while profile data is being fetched
const LoadingComponent = memo(() => (
  <div className="profile-screen">
    <div className="profile-container">
      <div className="profile-header">
        <PersonIcon className="profile-header-icon" />
        <h1>User Profile</h1>
      </div>
      <div className="profile-card">
        <div className="spinner"></div>
      </div>
    </div>
  </div>
))

LoadingComponent.displayName = 'LoadingComponent'

// Error component that displays error messages with retry functionality
const ErrorComponent = memo(({ error, onRetry }: { error: string, onRetry: () => void }) => (
  <div className="profile-screen">
    <div className="profile-container">
      <div className="profile-header">
        <PersonIcon className="profile-header-icon" />
        <h1>User Profile</h1>
      </div>
      <div className="profile-card">
        <div className="error-message">
          <p>❌ {error}</p>
          <button onClick={onRetry} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    </div>
  </div>
))

ErrorComponent.displayName = 'ErrorComponent'

// Main profile content component that displays user information in organized rows
const ProfileContent = memo(({ userProfile, empId }: { userProfile: any, empId: any }) => {
  // Memoize the profile info rows to prevent unnecessary re-renders
  const profileInfoRows = useMemo(() => {
    const rows = []
    
    if (userProfile.emp_name) {
      rows.push(
        <ProfileInfoRow key="emp_name" icon={PersonIcon} label="Employee Name" value={userProfile.emp_name} />
      )
    }
    
    rows.push(
      <ProfileInfoRow key="company" icon={BusinessIcon} label="Company" value={userProfile.company || 'Not set'} />
    )
    
    rows.push(
      <ProfileInfoRow key="department" icon={WorkIcon} label="Department" value={userProfile.department || 'Not set'} />
    )
    
    rows.push(
      <ProfileInfoRow key="position" icon={WorkIcon} label="Position" value={userProfile.position || 'Not set'} />
    )
    
    if (userProfile.level) {
      rows.push(
        <ProfileInfoRow key="level" icon={TrendingUpIcon} label="Level" value={userProfile.level} />
      )
    }
    
    if (userProfile.hire_date) {
      rows.push(
        <ProfileInfoRow key="hire_date" icon={EventIcon} label="Hire Date" value={userProfile.hire_date} />
      )
    }
    
    rows.push(
      <ProfileInfoRow key="empId" icon={BadgeIcon} label="Employee ID" value={empId} />
    )
    
    return rows
  }, [userProfile, empId])

  return (
    <div className="profile-screen">
      <div className="profile-container">
        <div className="profile-header">
          <PersonIcon className="profile-header-icon" />
          <h1>User Profile</h1>
        </div>
        
        <div className="profile-card">
          <div className="profile-avatar">
            <PersonIcon className="avatar-icon" />
          </div>
          
          <div className="profile-info">
            {profileInfoRows}
          </div>
        </div>
      </div>
    </div>
  )
})

ProfileContent.displayName = 'ProfileContent'

// Profile screen component that displays user profile information with loading and error states
const ProfileScreen: React.FC = () => {
  const userState = useSelector((state: RootState) => state.user)
  const empId = userState.empID
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Loads user profile data from the backend API
  const loadUserProfile = useCallback(async () => {
    if (!empId) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      const response = await fetch(`http://127.0.0.1:5000/get-user-preferences?empId=${empId}`)
      
      if (response.ok) {
        const profile = await response.json()
        setUserProfile(profile)
      } else {
        setError(`Failed to load profile: ${response.status}`)
      }
    } catch (error: any) {
      setError('Failed to load profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }, [empId])

  // Load user profile only when empId changes
  useEffect(() => {
    if (empId) {
      loadUserProfile()
    } else {
      setError('User not logged in')
      setIsLoading(false)
    }
  }, [empId, loadUserProfile])

  // Handles retry action for loading user profile data
  const handleRetry = useCallback(() => {
    loadUserProfile()
  }, [loadUserProfile])

  // Early returns for loading and error states
  if (isLoading) {
    return <LoadingComponent />
  }

  if (error) {
    return <ErrorComponent error={error} onRetry={handleRetry} />
  }

  if (!userProfile) {
    return <ErrorComponent error="No profile data available" onRetry={handleRetry} />
  }

  return <ProfileContent userProfile={userProfile} empId={empId} />
}

export default memo(ProfileScreen)
