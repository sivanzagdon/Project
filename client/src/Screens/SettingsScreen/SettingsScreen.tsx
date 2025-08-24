import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { userService } from '../../services/user.service'
import './SettingsScreen.css'

const SettingsScreen = () => {
    const userState = useSelector((state: RootState) => state.user)
    const empId = userState.empID

    // Active tab state
    const [activeTab, setActiveTab] = useState('account')

    // Account settings - Company & Role Info
    const [company, setCompany] = useState('')
    const [department, setDepartment] = useState('')
    const [position, setPosition] = useState('')
    const [level, setLevel] = useState('')
    const [employeeId, setEmployeeId] = useState('')
    const [hireDate, setHireDate] = useState('')
    const [isUpdatingAccount, setIsUpdatingAccount] = useState(false)

    // Privacy settings - Username & Password
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [username, setUsername] = useState('')
    const [profileVisibility, setProfileVisibility] = useState('public')
    const [activityStatus, setActivityStatus] = useState('visible')
    const [successMessage, setSuccessMessage] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [isUpdatingUsername, setIsUpdatingUsername] = useState(false)
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)
    const [isUpdatingPrivacy, setIsUpdatingPrivacy] = useState(false)

    const handleAccountUpdate = async () => {
        if (!company.trim() || !department.trim() || !position.trim()) {
            setErrorMessage('Company, Department, and Position are required')
            setSuccessMessage('')
            return
        }

        setIsUpdatingAccount(true)
        try {
            await userService.updateAccountInfo(empId, {
                company,
                department,
                position,
                level,
                employeeId,
                hireDate
            })
            setSuccessMessage('Account information updated successfully')
            setErrorMessage('')
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to update account information')
            setSuccessMessage('')
        } finally {
            setIsUpdatingAccount(false)
        }
    }

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            setErrorMessage("New passwords don't match")
            setSuccessMessage('')
            return
        }

        setIsUpdatingPassword(true)
        try {
            await userService.updatePassword(empId, currentPassword, newPassword)
            setSuccessMessage('Password updated successfully')
            setErrorMessage('')
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to update password')
            setSuccessMessage('')
        } finally {
            setIsUpdatingPassword(false)
        }
    }

    const handleUsernameChange = async () => {
        if (!username.trim()) {
            setErrorMessage('Username cannot be empty')
            setSuccessMessage('')
            return
        }

        setIsUpdatingUsername(true)
        try {
            await userService.updateUsername(empId, username)
            setSuccessMessage('Username updated successfully')
            setErrorMessage('')
            setUsername('')
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to update username')
            setSuccessMessage('')
        } finally {
            setIsUpdatingUsername(false)
        }
    }

    const handlePrivacySettingsUpdate = async () => {
        setIsUpdatingPrivacy(true)
        try {
            await userService.updatePrivacySettings(empId, {
                profileVisibility,
                activityStatus
            })
            setSuccessMessage('Privacy settings updated successfully')
            setErrorMessage('')
        } catch (error: any) {
            setErrorMessage(error.message || 'Failed to update privacy settings')
            setSuccessMessage('')
        } finally {
            setIsUpdatingPrivacy(false)
        }
    }

    const loadUserPreferences = async () => {
        try {
            // Load user preferences from the new endpoint
            const response = await fetch(`http://127.0.0.1:5000/get-user-preferences?empId=${empId}`)
            if (response.ok) {
                const preferences = await response.json()
                console.log('User preferences loaded:', preferences)
                
                // Set account info
                if (preferences.company) setCompany(preferences.company)
                if (preferences.department) setDepartment(preferences.department)
                if (preferences.position) setPosition(preferences.position)
                if (preferences.level) setLevel(preferences.level)
                if (preferences.employee_id) setEmployeeId(preferences.employee_id)
                if (preferences.hire_date) setHireDate(preferences.hire_date)
                
                // Set privacy settings
                if (preferences.privacy_settings) {
                    const privacy = preferences.privacy_settings
                    if (privacy.profileVisibility) setProfileVisibility(privacy.profileVisibility)
                    if (privacy.activityStatus) setActivityStatus(privacy.activityStatus)
                }
                
                console.log('All preferences loaded successfully')
            } else {
                console.log('No preferences found, using defaults')
            }
        } catch (error) {
            console.error('Failed to load preferences:', error)
        }
    }

    useEffect(() => {
        if (empId) {
            loadUserPreferences()
        }
    }, [empId])

    const renderAccountTab = () => (
        <div className="tab-content">
            <div className="section">
                <h3 className="section-title">Company Information</h3>
                <div className="input-group">
                    <label className="label">Company Name *</label>
                    <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="Enter company name"
                        className="input"
                    />
                </div>
                <div className="input-group">
                    <label className="label">Department *</label>
                    <input
                        type="text"
                        value={department}
                        onChange={(e) => setDepartment(e.target.value)}
                        placeholder="Enter department"
                        className="input"
                    />
                </div>
                <div className="input-group">
                    <label className="label">Position *</label>
                    <input
                        type="text"
                        value={position}
                        onChange={(e) => setPosition(e.target.value)}
                        placeholder="Enter your position"
                        className="input"
                    />
                </div>
                <div className="input-group">
                    <label className="label">Level</label>
                    <select 
                        value={level} 
                        onChange={(e) => setLevel(e.target.value)}
                        className="select-input"
                    >
                        <option value="">Select level</option>
                        <option value="junior">Junior</option>
                        <option value="mid">Mid-Level</option>
                        <option value="senior">Senior</option>
                        <option value="lead">Team Lead</option>
                        <option value="manager">Manager</option>
                        <option value="director">Director</option>
                        <option value="executive">Executive</option>
                    </select>
                </div>
                <div className="input-group">
                    <label className="label">Employee ID</label>
                    <input
                        type="text"
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        placeholder="Enter employee ID"
                        className="input"
                    />
                </div>
                <div className="input-group">
                    <label className="label">Hire Date</label>
                    <input
                        type="date"
                        value={hireDate}
                        onChange={(e) => setHireDate(e.target.value)}
                        className="input"
                    />
                </div>
                <button 
                    onClick={handleAccountUpdate} 
                    className="button"
                    disabled={isUpdatingAccount}
                >
                    {isUpdatingAccount ? (
                        <>
                            <span className="loading-spinner"></span>
                            Updating...
                        </>
                    ) : (
                        'Update Account Information'
                    )}
                </button>
            </div>
        </div>
    )

    const renderPrivacyTab = () => (
        <div className="tab-content">
            <div className="section">
                <h3 className="section-title">Update Username</h3>
                <div className="input-group">
                    <label className="label">New Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter new username"
                        className="input"
                    />
                    <button 
                        onClick={handleUsernameChange} 
                        className="button"
                        disabled={isUpdatingUsername}
                    >
                        {isUpdatingUsername ? (
                            <>
                                <span className="loading-spinner"></span>
                                Updating...
                            </>
                        ) : (
                            'Update Username'
                        )}
                    </button>
                </div>
            </div>

            <div className="section">
                <h3 className="section-title">Change Password</h3>
                <div className="input-group">
                    <label className="label">Current Password</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Enter current password"
                        className="input"
                    />
                </div>
                <div className="input-group">
                    <label className="label">New Password</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                        className="input"
                    />
                </div>
                <div className="input-group">
                    <label className="label">Confirm New Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        className="input"
                    />
                </div>
                <button 
                    onClick={handlePasswordChange} 
                    className="button"
                    disabled={isUpdatingPassword}
                >
                    {isUpdatingPassword ? (
                        <>
                            <span className="loading-spinner"></span>
                            Updating...
                        </>
                    ) : (
                        'Change Password'
                    )}
                </button>
            </div>

            <div className="section">
                <h3 className="section-title">Privacy Preferences</h3>
                <div className="setting-group">
                    <label className="label">Profile Visibility</label>
                    <select 
                        value={profileVisibility} 
                        onChange={(e) => setProfileVisibility(e.target.value)}
                        className="select-input"
                    >
                        <option value="public">Public</option>
                        <option value="team">Team Only</option>
                        <option value="private">Private</option>
                    </select>
                </div>
                <div className="setting-group">
                    <label className="label">Activity Status</label>
                    <select 
                        value={activityStatus} 
                        onChange={(e) => setActivityStatus(e.target.value)}
                        className="select-input"
                    >
                        <option value="visible">Visible to Team</option>
                        <option value="away">Show as Away</option>
                        <option value="hidden">Hidden</option>
                    </select>
                </div>
                <button 
                    onClick={handlePrivacySettingsUpdate} 
                    className="button"
                    disabled={isUpdatingPrivacy}
                >
                    {isUpdatingPrivacy ? (
                        <>
                            <span className="loading-spinner"></span>
                            Updating...
                        </>
                    ) : (
                        'Update Privacy Settings'
                    )}
                </button>
            </div>
        </div>
    )

    return (
        <div className="settings-container">
            <h2 className="main-title">Settings</h2>
            
            {/* Settings Navigation Tabs */}
            <div className="settings-tabs">
                <button 
                    className={`tab-button ${activeTab === 'account' ? 'active' : ''}`}
                    onClick={() => setActiveTab('account')}
                >
                    <span className="tab-icon">👤</span>
                    Account
                </button>
                <button 
                    className={`tab-button ${activeTab === 'privacy' ? 'active' : ''}`}
                    onClick={() => setActiveTab('privacy')}
                >
                    <span className="tab-icon">🔒</span>
                    Privacy
                </button>
            </div>

            {/* Tab Content */}
            <div className="tab-container">
                {activeTab === 'account' && renderAccountTab()}
                {activeTab === 'privacy' && renderPrivacyTab()}
            </div>

            {/* Messages */}
            {successMessage && <div className="success">{successMessage}</div>}
            {errorMessage && <div className="error">{errorMessage}</div>}
        </div>
    )
}

export default SettingsScreen

