import React, { useState } from 'react'
import { Tabs, Tab } from '@mui/material'
import DashboardPage from '../Screens/DashboardScreen/DashboardScreen'
import NewTicketForm from '../Screens/newTicketForm/newTicketForm'

export default function MainLayout() {
  const [tab, setTab] = useState('dashboard')

  return (
    <div style={{ padding: '2rem', minHeight: '100vh' }}>
      <Tabs
        value={tab}
        onChange={(e, newValue: string) => setTab(newValue)}
        centered
        textColor="inherit"
        TabIndicatorProps={{
          style: {
            backgroundColor: '#000', // קו תחתון שחור
          },
        }}
      >
        <Tab
          label="DASHBOARD"
          value="dashboard"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            color: tab === 'dashboard' ? '#111827' : '#6B7280', // כהה אם נבחר, אפור אם לא
            textTransform: 'none',
          }}
        />
        <Tab
          label="NEW REQUEST"
          value="new_request"
          sx={{
            fontFamily: 'Inter, sans-serif',
            fontWeight: 600,
            fontSize: '16px',
            color: tab === 'new_request' ? '#111827' : '#6B7280',
            textTransform: 'none',
          }}
        />
      </Tabs>

      <div style={{ marginTop: '2rem' }}>
        {tab === 'dashboard' && <DashboardPage />}
        {tab === 'new_request' && <NewTicketForm />}
      </div>
    </div>
  )
}
