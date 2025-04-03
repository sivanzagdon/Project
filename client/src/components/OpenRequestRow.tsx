import React from 'react'

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

const OpenRequestRow: React.FC<{ request: OpenRequest }> = ({ request }) => {
  return (
    <div style={styles.rowContainer}>
      <div style={styles.fieldContainer}>{request['Created on']}</div>
      <div style={styles.fieldContainer}>{request['Request status']}</div>
      <div style={styles.fieldContainer}>{request['MainCategory']}</div>
      <div style={styles.fieldContainer}>{request['SubCategory']}</div>
      <div style={styles.fieldContainer}>{request['Building']}</div>
      <div style={styles.fieldContainer}>{request['Site']}</div>
      <div style={styles.fieldContainer}>{request['Request description']}</div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  rowContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '5px',
    borderBottom: '1px solid #ccc',
    textAlign: 'center',
  },
  fieldContainer: {
    flex: 1,
    padding: '5px',
    fontSize: '14px',
    wordBreak: 'break-word',
  },
}

export default OpenRequestRow
