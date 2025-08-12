import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { userService } from '../../services/user.service'

const SettingsScreen = () => {
    const userState = useSelector((state: RootState) => state.user)
    console.log('userState', userState)
    const empId = userState.empID

    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [darkMode, setDarkMode] = useState(false)
    const [notificationsEnabled, setNotificationsEnabled] = useState(true)
    const [username, setUsername] = useState('')
    const [successMessage, setSuccessMessage] = useState('')

    const handlePasswordChange = async () => {
        if (newPassword !== confirmPassword) {
            alert("New passwords don't match")
            return
        }

        try {
            await userService.updatePassword(empId, currentPassword, newPassword)
            setSuccessMessage('Password updated successfully')
        } catch {
            alert('Failed to update password')
        }
    }

    const handleUsernameChange = async () => {
        if (!username.trim()) return

        try {
            await userService.updateUsername(empId, username)
            setSuccessMessage('Username updated successfully')
        } catch {
            alert('Failed to update username')
        }
    }

    const handleDeleteAccount = async () => {
        if (
            window.confirm(
                'Are you sure you want to delete your account? This action cannot be undone.'
            )
        ) {
            try {
                await userService.deleteAccount(empId)
                setSuccessMessage('Account deleted successfully')
            } catch {
                alert('Failed to delete account')
            }
        }
    }

    useEffect(() => {
        const updatePrefs = async () => {
            try {
                await userService.updatePreferences(empId, darkMode, notificationsEnabled)
            } catch {
                console.warn('Failed to update preferences')
            }
        }
        updatePrefs()
    }, [darkMode, notificationsEnabled])

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Settings</h2>

            <div style={styles.section}>
                <label style={styles.label}>Update Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="New username"
                    style={styles.input}
                />
                <button onClick={handleUsernameChange} style={styles.button}>
                    Update Username
                </button>
            </div>

            <div style={styles.section}>
                <label style={styles.label}>Current Password</label>
                <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    style={styles.input}
                />
                <label style={styles.label}>New Password</label>
                <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    style={styles.input}
                />
                <label style={styles.label}>Confirm New Password</label>
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.input}
                />
                <button onClick={handlePasswordChange} style={styles.button}>
                    Change Password
                </button>
            </div>

            <div style={styles.section}>
                <label style={styles.label}>Dark Mode</label>
                <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                />
            </div>

            <div style={styles.section}>
                <label style={styles.label}>Enable Notifications</label>
                <input
                    type="checkbox"
                    checked={notificationsEnabled}
                    onChange={() => setNotificationsEnabled(!notificationsEnabled)}
                />
            </div>

            <div style={styles.section}>
                <button
                    onClick={handleDeleteAccount}
                    style={{ ...styles.button, backgroundColor: '#dc2626' }}
                >
                    Delete Account
                </button>
            </div>

            {successMessage && <div style={styles.success}>{successMessage}</div>}
        </div>
    )
}

const styles: Record<string, React.CSSProperties> = {
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '10px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    },
    title: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '20px',
    },
    section: {
        marginBottom: '20px',
    },
    label: {
        display: 'block',
        fontWeight: 500,
        marginBottom: '5px',
    },
    input: {
        width: '100%',
        padding: '8px',
        borderRadius: '6px',
        border: '1px solid #ccc',
        marginBottom: '10px',
    },
    button: {
        padding: '10px 16px',
        backgroundColor: '#2563eb',
        color: 'white',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
    },
    success: {
        color: 'green',
        marginTop: '12px',
    },
}

export default SettingsScreen
