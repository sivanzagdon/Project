import React, { useState, useEffect } from 'react'
import { requestService } from '../../services/request.service'
import Loading from '../../components/Loading/Loading'
import './OpenRequests.style.css';

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
  const getStatusBadge = (status: string) => {
    return <div className="status-badge">{status}</div>
  }

  return (
    <div className="row-card">
      <div className="cell">{request['Created on']}</div>
      <div className="cell">{getStatusBadge(request['Request status'])}</div>
      <div className="cell">{request.MainCategory}</div>
      <div className="cell">{request.SubCategory}</div>
      <div className="cell">{request.Building}</div>
      <div className="cell">{request.Site}</div>
      <div className="cell">{request['Request description']}</div>
    </div>
  )
}

const OpenRequests = () => {
  const [requests, setRequests] = useState<OpenRequest[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<'date-asc' | 'date-desc' | 'category-asc' | 'category-desc' | 'building-asc' | 'building-desc'>('date-desc')

  useEffect(() => {
    requestService
      .getOpenRequests()
      .then((data) => setRequests(data))
      .catch((error) => console.error('Error fetching open requests:', error))
  }, [])

  const filteredRequests = requests
    .filter((r) => {
      const combinedText = (
        r['Created on'] +
        r['Request status'] +
        r.MainCategory +
        r.SubCategory +
        r.Building +
        r.Site +
        r['Request description']
      ).toLowerCase()
      return combinedText.includes(searchTerm.toLowerCase())
    })
    .sort((a, b) => {
      const [key, direction] = sortOption.split('-')
      let valA, valB
      if (key === 'date') {
        valA = new Date(a['Created on']).getTime()
        valB = new Date(b['Created on']).getTime()
      } else if (key === 'category') {
        valA = a.MainCategory.toLowerCase()
        valB = b.MainCategory.toLowerCase()
      } else {
        valA = a.Building.toLowerCase()
        valB = b.Building.toLowerCase()
      }
      if (valA < valB) return direction === 'asc' ? -1 : 1
      if (valA > valB) return direction === 'asc' ? 1 : -1
      return 0
    })

  const sortLabel = {
    'date-asc': 'Sort by: Date - Oldest First',
    'date-desc': 'Sort by: Date - Newest First',
    'category-asc': 'Sort by: Category - A to Z',
    'category-desc': 'Sort by: Category - Z to A',
    'building-asc': 'Sort by: Building - A to Z',
    'building-desc': 'Sort by: Building - Z to A',
  }

  return (
    <div className="open-requests-container">
      {/* Filters */}
      <div className="filters-wrapper">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as typeof sortOption)}
          className="select-input">
          <option disabled value="">Sort by...</option>
          <option value="date-asc">Date - Oldest First</option>
          <option value="date-desc">Date - Newest First</option>
          <option value="category-asc">Category - A to Z</option>
          <option value="category-desc">Category - Z to A</option>
          <option value="building-asc">Building - A to C</option>
          <option value="building-desc">Building - C to A</option>
        </select>
      </div>

      <div className="sort-label">{sortLabel[sortOption]}</div>

      <div className="header-row">
        <div className="header">Created on</div>
        <div className="header">Status</div>
        <div className="header">Main Category</div>
        <div className="header">SubCategory</div>
        <div className="header">Building</div>
        <div className="header">Site</div>
        <div className="header">Description</div>
      </div>

      {filteredRequests.length === 0 ? (
        <Loading />
      ) : (
        filteredRequests.map((request: OpenRequest) => (
          <OpenRequestRow key={request.id} request={request} />
        ))
      )}
    </div>
  )
}

export default OpenRequests