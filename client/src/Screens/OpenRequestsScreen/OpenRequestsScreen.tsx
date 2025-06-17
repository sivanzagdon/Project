import React, { useState, useEffect } from 'react'
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

const OpenRequestRow: React.FC<{ request: OpenRequest }> = ({ request }) => {
  const getStatusBadge = (status: string) => {
    const statusStyles: React.CSSProperties = {
      backgroundColor: '#d1fae5',
      color: '#065f46',
      padding: '2px 8px',
      borderRadius: '12px',
      fontWeight: 600,
      fontSize: '12px',
      display: 'inline-block',
      textAlign: 'center',
    }
    return <div style={statusStyles}>{status}</div>
  }

  return (
    <div style={styles.rowCard}>
      <div style={styles.cell}>{request['Created on']}</div>
      <div style={styles.cell}>{getStatusBadge(request['Request status'])}</div>
      <div style={styles.cell}>{request.MainCategory}</div>
      <div style={styles.cell}>{request.SubCategory}</div>
      <div style={styles.cell}>{request.Building}</div>
      <div style={styles.cell}>{request.Site}</div>
      <div style={styles.cell}>{request['Request description']}</div>
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
    <div style={styles.container}>
      {/* Filters */}
      <div style={styles.filtersWrapper}>
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
        />
        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value as typeof sortOption)}
          style={styles.selectInput}>
          <option disabled value="">Sort by...</option>
          <option value="date-asc">Date - Oldest First</option>
          <option value="date-desc">Date - Newest First</option>
          <option value="category-asc">Category - A to Z</option>
          <option value="category-desc">Category - Z to A</option>
          <option value="building-asc">Building - A to C</option>
          <option value="building-desc">Building - C to A</option>
        </select>
      </div>

      <div style={styles.sortLabel}>{sortLabel[sortOption]}</div>

      <div style={styles.headerRow}>
        <div style={styles.header}>Created on</div>
        <div style={styles.header}>Status</div>
        <div style={styles.header}>Main Category</div>
        <div style={styles.header}>SubCategory</div>
        <div style={styles.header}>Building</div>
        <div style={styles.header}>Site</div>
        <div style={styles.header}>Description</div>
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

const styles: Record<string, React.CSSProperties> = {
  container: {
    margin: '20px auto',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#ffffff',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.08)',
    maxWidth: '98%',
    overflowX: 'auto',
  },
  filtersWrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: '16px',
    gap: '12px',
    alignItems: 'center',
  },
  searchInput: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    flex: 1,
  },
  selectInput: {
    padding: '8px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    minWidth: '220px'
  },
  sortLabel: {
    display: 'none'
  },
  headerRow: {
    display: 'grid',
    gridTemplateColumns: '120px 80px 160px 160px 80px 60px 1fr',
    backgroundColor: '#333',
    color: '#fff',
    padding: '12px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    marginBottom: '10px',
    gap: '10px',
  },
  header: {
    padding: '4px 8px',
  },
  rowCard: {
    display: 'grid',
    gridTemplateColumns: '120px 80px 160px 160px 80px 60px 1fr',
    gap: '10px',
    padding: '12px',
    backgroundColor: '#f9f9f9',
    border: '1px solid #ddd',
    borderRadius: '8px',
    marginBottom: '8px',
    fontSize: '14px',
    alignItems: 'center',
    transition: 'background-color 0.2s ease',
  },
  cell: {
    padding: '4px 8px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
}

export default OpenRequests
