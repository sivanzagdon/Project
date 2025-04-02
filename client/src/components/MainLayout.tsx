import React, { useState } from 'react'
import { Tabs, Tab } from '@mui/material'
import DashboardPage from '../Screens/DashboardScreen/DashboardScreen' // שימי לב לנתיב – תעדכני בהתאם למיקום בפועל
import NewTicketForm from '../Screens/newTicketForm/newTicketForm'

export default function MainLayout() {
  const [tab, setTab] = useState('dashboard')

  return (
    <div style={{ padding: '2rem' }}>
      <Tabs
        value={tab}
        onChange={(e, newValue: string) => setTab(newValue)}
        centered
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab label="DASHBOARD" value="dashboard" />
        <Tab label="NEW REQUEST" value="new_request" />
      </Tabs>

      <div style={{ marginTop: '2rem' }}>
        {tab === 'dashboard' && <DashboardPage />}
        {tab === 'new_request' && <NewTicketForm />}
      </div>
    </div>
  )
}
