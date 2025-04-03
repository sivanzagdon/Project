import React, { useState, useEffect } from 'react'
import OpenRequestRow from '../../components/OpenRequestRow'
import { requestService } from '../../services/request.service'
import Loading from '../../components/Loading'

interface OpenRequest {
  id: string
  'Created on': string
  'Request status': string
  MainCategory: string
  SubCategory: string
  Building: string
  Site: string
  'Request description': string
}

const OpenRequests = () => {
  const [requests, setRequests] = useState<OpenRequest[]>([])

  useEffect(() => {
    requestService
      .getOpenRequests()
      .then((data) => setRequests(data))
      .catch((error) => console.error('Error fetching open requests:', error))
  }, [])

  return (
    <div style={styles.container}>
      {/* Header Row */}
      <div style={styles.headerRow}>
        <div style={styles.header}>Created on</div>
        <div style={styles.header}>Status</div>
        <div style={styles.header}>Main Category</div>
        <div style={styles.header}>SubCategory</div>
        <div style={styles.header}>Building</div>
        <div style={styles.header}>Site</div>
        <div style={styles.header}>Description</div>
      </div>

      {/* Data Rows */}
      {requests.length === 0 ? (
        <Loading />
      ) : (
        requests.map((request: OpenRequest) => (
          <OpenRequestRow key={request.id} request={request} />
        ))
      )}
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    margin: '20px',
    padding: '10px',
    borderRadius: '8px',
    backgroundColor: '#f4f4f4',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
  },
  headerRow: {
    display: 'flex', // שימוש ב-Flexbox
    justifyContent: 'space-between', // פיזור אחיד של העמודות
    padding: '5px 0', // צמצום padding בכותרת
    backgroundColor: '#A9A9A9', // אפור חזק יותר
    color: 'black',
    borderRadius: '8px',
    marginBottom: '10px',
    textAlign: 'center',
  },
  header: {
    fontWeight: 'bold',
    padding: '2px', // padding קטן יותר
    flex: 1,
  },
}

export default OpenRequests
