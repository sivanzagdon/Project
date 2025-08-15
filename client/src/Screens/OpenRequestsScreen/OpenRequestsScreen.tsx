import React, { useState, useEffect } from 'react'
import { requestService } from '../../services/request.service'
import Loading from '../../components/Loading/Loading'
import SearchIcon from '@mui/icons-material/Search'
import SortIcon from '@mui/icons-material/Sort'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import FirstPageIcon from '@mui/icons-material/FirstPage'
import LastPageIcon from '@mui/icons-material/LastPage'
import './OpenRequests.style.css'

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
    return (
      <div
        className="status-badge"
        style={{
          backgroundColor: '#dbeafe',
          color: '#10b981',
          border: '1px solid #10b98120'
        }}
      >
        {status}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="row-card">
      <div className="cell date-cell">{formatDate(request['Created on'])}</div>
      <div className="cell status-cell">{getStatusBadge(request['Request status'])}</div>
      <div className="cell category-cell">{request.MainCategory}</div>
      <div className="cell subcategory-cell">{request.SubCategory}</div>
      <div className="cell building-cell">{request.Building}</div>
      <div className="cell site-cell">{request.Site}</div>
      <div className="cell description-cell" title={request['Request description']}>
        {request['Request description']}
      </div>
    </div>
  )
}

const Pagination: React.FC<{
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems: number
  itemsPerPage: number
}> = ({ currentPage, totalPages, onPageChange, totalItems, itemsPerPage }) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  const renderPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1)
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`page-number ${i === currentPage ? 'active' : ''}`}
        >
          {i}
        </button>
      )
    }

    return pages
  }

  return (
    <div className="pagination-container">
      <div className="pagination-info">
        Showing {startItem}-{endItem} of {totalItems} requests
      </div>

      <div className="pagination-controls">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="pagination-button"
          title="First page"
        >
          <FirstPageIcon />
        </button>

        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="pagination-button"
          title="Previous page"
        >
          <ChevronLeftIcon />
        </button>

        <div className="page-numbers">
          {renderPageNumbers()}
        </div>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="pagination-button"
          title="Next page"
        >
          <ChevronRightIcon />
        </button>

        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="pagination-button"
          title="Last page"
        >
          <LastPageIcon />
        </button>
      </div>
    </div>
  )
}

const OpenRequests = () => {
  const [requests, setRequests] = useState<OpenRequest[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [sortOption, setSortOption] = useState<'date-asc' | 'date-desc' | 'category-asc' | 'category-desc' | 'building-asc' | 'building-desc'>('date-desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const itemsPerPage = 25

  useEffect(() => {
    setIsLoading(true)
    requestService
      .getOpenRequests()
      .then((data) => {
        setRequests(data)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error('Error fetching open requests:', error)
        setIsLoading(false)
      })
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

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, sortOption])

  // Calculate pagination
  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentRequests = filteredRequests.slice(startIndex, endIndex)

  const sortLabel = {
    'date-asc': 'Date - Oldest First',
    'date-desc': 'Date - Newest First',
    'category-asc': 'Category - A to Z',
    'category-desc': 'Category - Z to A',
    'building-asc': 'Building - A to Z',
    'building-desc': 'Building - Z to A',
  }

  if (isLoading) {
    return (
      <div className="open-requests-container">
        <div className="loading-wrapper">
          <Loading />
        </div>
      </div>
    )
  }

  return (
    <div className="open-requests-container">
      {/* Header */}
      <div className="page-header">
        <h1 className="page-title">Open Requests</h1>
        <p className="page-subtitle">Manage and track all your open requests</p>
      </div>

      {/* Filters */}
      <div className="filters-section">
        <div className="filters-wrapper">
          <div className="search-wrapper">
            <SearchIcon className="search-icon" />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="sort-wrapper">
            <SortIcon className="sort-icon" />
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as typeof sortOption)}
              className="select-input"
            >
              <option value="date-desc">Newest First</option>
              <option value="date-asc">Oldest First</option>
              <option value="category-asc">Category A-Z</option>
              <option value="category-desc">Category Z-A</option>
              <option value="building-asc">Building A-Z</option>
              <option value="building-desc">Building Z-A</option>
            </select>
          </div>
        </div>

        <div className="results-info">
          <span className="results-count">{filteredRequests.length} requests found</span>
          <span className="sort-label">Sorted by: {sortLabel[sortOption]}</span>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <div className="header-row">
          <div className="header">Created</div>
          <div className="header">Status</div>
          <div className="header">Category</div>
          <div className="header">Subcategory</div>
          <div className="header">Building</div>
          <div className="header">Site</div>
          <div className="header">Description</div>
        </div>

        <div className="table-body">
          {currentRequests.length === 0 ? (
            <div className="no-results">
              <p>No requests found matching your criteria.</p>
            </div>
          ) : (
            currentRequests.map((request: OpenRequest) => (
              <OpenRequestRow key={request.id} request={request} />
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {filteredRequests.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredRequests.length}
          itemsPerPage={itemsPerPage}
        />
      )}
    </div>
  )
}

export default OpenRequests