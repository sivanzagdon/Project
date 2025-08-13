import React from 'react'
import './OpenRequestRow.css'

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
    <div className="row-container">
      <div className="field-container">{request['Created on']}</div>
      <div className="field-container">{request['Request status']}</div>
      <div className="field-container">{request['MainCategory']}</div>
      <div className="field-container">{request['SubCategory']}</div>
      <div className="field-container">{request['Building']}</div>
      <div className="field-container">{request['Site']}</div>
      <div className="field-container">{request['Request description']}</div>
    </div>
  )
}

export default OpenRequestRow