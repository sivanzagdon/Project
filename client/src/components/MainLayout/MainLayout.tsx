import React, { useState } from 'react'
import { Tabs, Tab } from '@mui/material'
import './MainLayout.css'
import DashboardPage from '../../Screens/DashboardScreen/DashboardScreen'
import DashboardOpenScreen from '../../Screens/DashboardOpenScreen/DashboardOpenScreen'

export default function MainLayout() {
  const [tab, setTab] = useState('dashboard')

  return (
    <div className="main-layout">
      <Tabs
        value={tab}
        onChange={(e, newValue: string) => setTab(newValue)}
        centered
        textColor="inherit"
        className="custom-tabs"
        TabIndicatorProps={{
          style: {
            backgroundColor: '#000',
          },
        }}
      >
        <Tab
          label="DASHBOARD"
          value="dashboard"
          className={`custom-tab ${tab === 'dashboard' ? 'active' : 'inactive'}`}
        />
        <Tab
          label="OPEN REQUESTS"
          value="opens"
          className={`custom-tab ${tab === 'opens' ? 'active' : 'inactive'}`}
        />
      </Tabs>

      <div className="tab-content">
        {tab === 'dashboard' && <DashboardPage />}
        {tab === 'opens' && <DashboardOpenScreen />}
      </div>
    </div>
  )
}