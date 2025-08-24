import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import PersonIcon from '@mui/icons-material/Person'
import BusinessIcon from '@mui/icons-material/Business'
import WorkIcon from '@mui/icons-material/Work'
import TrendingUpIcon from '@mui/icons-material/TrendingUp'
import EventIcon from '@mui/icons-material/Event'
import BadgeIcon from '@mui/icons-material/Badge'
import './ProfileScreen.css'

const ProfileScreen: React.FC = () => {
  const userState = useSelector((state: RootState) => state.user)
  const empId = userState.empID
  const [userProfile, setUserProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (empId) {
      loadUserProfile()
    } else {
      setError('User not logged in')
      setIsLoading(false)
    }
  }, [empId])

  const loadUserProfile = async () => {
    try {
      setIsLoading(true)
      setError(null)
      console.log('Loading user profile for empId:', empId, 'Type:', typeof empId)
      
      const response = await fetch(`http://127.0.0.1:5000/get-user-preferences?empId=${empId}`)
      console.log('Response status:', response.status)
      
      if (response.ok) {
        const profile = await response.json()
        console.log('Profile loaded successfully:', profile)
        setUserProfile(profile)
      } else {
        const errorText = await response.text()
        console.error('Failed to load profile, status:', response.status, 'Error:', errorText)
        setError(`Failed to load profile: ${response.status}`)
      }
    } catch (error: any) {
      console.error('Failed to load user profile:', error)
      setError('Failed to load profile. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="profile-screen">
        <div className="profile-container">
          <div className="profile-header">
            <PersonIcon className="profile-header-icon" />
            <h1>User Profile</h1>
          </div>
          <div className="profile-card">
            <div className="loading-spinner">
              <div className="spinner"></div>
              <p>Loading profile information...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="profile-screen">
        <div className="profile-container">
          <div className="profile-header">
            <PersonIcon className="profile-header-icon" />
            <h1>User Profile</h1>
          </div>
          <div className="profile-card">
            <div className="error-message">
              <p>❌ {error}</p>
              <button onClick={loadUserProfile} className="retry-button">
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="profile-screen">
      <div className="profile-container">
        <div className="profile-header">
          <PersonIcon className="profile-header-icon" />
          <h1>User Profile</h1>
        </div>
        
        {userProfile && (
          <div className="profile-card">
            <div className="profile-avatar">
              <PersonIcon className="avatar-icon" />
            </div>
            
            <div className="profile-info">
              {/* Employee Name */}
              {userProfile.emp_name && (
                <div className="info-row">
                  <div className="info-label">
                    <PersonIcon className="info-icon" />
                    <span>Employee Name</span>
                  </div>
                  <div className="info-value">{userProfile.emp_name}</div>
                </div>
              )}
              
              {/* Company */}
              <div className="info-row">
                <div className="info-label">
                  <BusinessIcon className="info-icon" />
                  <span>Company</span>
                </div>
                <div className="info-value">{userProfile.company || 'Not set'}</div>
              </div>
              
              {/* Department */}
              <div className="info-row">
                <div className="info-label">
                  <WorkIcon className="info-icon" />
                  <span>Department</span>
                </div>
                <div className="info-value">{userProfile.department || 'Not set'}</div>
              </div>
              
              {/* Position */}
              <div className="info-row">
                <div className="info-label">
                  <WorkIcon className="info-icon" />
                  <span>Position</span>
                </div>
                <div className="info-value">{userProfile.position || 'Not set'}</div>
              </div>
              
              {/* Level */}
              {userProfile.level && (
                <div className="info-row">
                  <div className="info-label">
                    <TrendingUpIcon className="info-icon" />
                    <span>Level</span>
                  </div>
                  <div className="info-value">{userProfile.level}</div>
                </div>
              )}
              
              {/* Hire Date */}
              {userProfile.hire_date && (
                <div className="info-row">
                  <div className="info-label">
                    <EventIcon className="info-icon" />
                    <span>Hire Date</span>
                  </div>
                  <div className="info-value">{userProfile.hire_date}</div>
                </div>
              )}
              
              {/* Employee ID */}
              <div className="info-row">
                <div className="info-label">
                  <BadgeIcon className="info-icon" />
                  <span>Employee ID</span>
                </div>
                <div className="info-value">{empId}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileScreen
