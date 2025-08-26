// src/pages/NewTicketForm/NewTicketForm.tsx
import React, { useState, useEffect } from 'react'
import { requestService } from '../../services/request.service'
import { TicketResponse } from '../../types/request.type'
import Loading from '../../components/Loading/Loading'
import './NewTicketForm.css'
import RiskReveal from '../../components/RiskReveal/RiskReveal'

const round = (n: number, d = 2) => Math.round(n * 10 ** d) / 10 ** d
const toBucket = (p: number): 'Low' | 'Medium' | 'High' => {
  if (p >= 0.66) return 'High'
  if (p >= 0.33) return 'Medium'
  return 'Low'
}
const bucketLabel = (b: 'Low' | 'Medium' | 'High') =>
  b === 'Low' ? 'Low Risk' : b === 'Medium' ? 'Medium Risk' : 'High Risk'
const bucketColor = (b: 'Low' | 'Medium' | 'High') =>
  b === 'Low' ? 'green' : b === 'Medium' ? 'orange' : 'red'

// Form component for creating new service requests with ML predictions and risk assessment
const NewTicketForm: React.FC = () => {
  const [MainCategory, setMainCategory] = useState('')
  const [SubCategory, setSubCategory] = useState('')
  const [Building, setBuilding] = useState('')
  const [Site, setSite] = useState('')
  const [Description, setDescription] = useState('')

  const [sla, setSla] = useState('')
  const [prediction, setPrediction] = useState<number | null>(null)
  const [predictedHours, setPredictedHours] = useState<number | null>(null)
  const [riskBucket, setRiskBucket] = useState<
    'Low' | 'Medium' | 'High' | null
  >(null)
  const [inconsistent, setInconsistent] = useState<boolean>(false)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [categoriesData, setCategoriesData] = useState<any>({})
  const [subCategoriesOptions, setSubCategoriesOptions] = useState<
    { value: string; label: string }[]
  >([])

  // טוען קטגוריות מקובץ public/data.json
  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((data) => setCategoriesData(data))
      .catch((error) => console.error('Error loading categories data:', error))
  }, [])

  // מעדכן רשימת תתי קטגוריה לפי קטגוריה ראשית
  useEffect(() => {
    if (MainCategory && categoriesData[MainCategory]) {
      const subCategories = categoriesData[MainCategory].map(
        (subCat: string) => ({ value: subCat, label: subCat })
      )
      setSubCategoriesOptions(subCategories)
      if (subCategories.length === 0) setSubCategory('')
    }
  }, [MainCategory, categoriesData])

  // Handles form submission by creating a new service request and displaying ML predictions
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!MainCategory || !SubCategory) {
      alert('Please select both a main category and a subcategory.')
      return
    }

    setIsLoading(true)
    const ticketData = {
      MainCategory,
      SubCategory,
      Building,
      Site,
      Description,
    }

    try {
      const res: TicketResponse = await requestService.createTicket(ticketData)
      console.log('Ticket API response', res)

      const slaHours =
        typeof res.sla_time === 'number'
          ? res.sla_time
          : typeof res.sla_hours === 'number'
          ? res.sla_hours
          : 0
      setSla(`${slaHours} Hours`)

      const prob =
        typeof res.overdue_probability === 'number'
          ? res.overdue_probability
          : typeof res.risk_score === 'number'
          ? res.risk_score
          : 0
      const bucket = res.risk_bucket ?? toBucket(prob)
      setPrediction(prob)
      setRiskBucket(bucket)

      const ph =
        typeof res.predicted_hours === 'number' ? res.predicted_hours : null
      setPredictedHours(ph)

      setRecommendations(res.recommendations || [])

      const isInconsistent =
        ph !== null &&
        ((ph >= slaHours * 2 && prob < 0.33) ||
          (ph <= slaHours * 0.7 && prob > 0.66))
      setInconsistent(isInconsistent)
    } catch (error) {
      console.error('Adding a request failed', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="ticket-page">
      <div className="form-container">
        <h2 className="form-header">Create New Service Request</h2>

        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="input-group">
            <label className="form-label">Main Category</label>
            <div className="select-wrapper">
              <select
                value={MainCategory}
                onChange={(e) => setMainCategory(e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select category</option>
                <option value="A. Cleaning">A. Cleaning</option>
                <option value="B. Climate">B. Climate</option>
                <option value="C. Office & Kitchen & Printer Corner">
                  C. Office & Kitchen & Printer Corner
                </option>
                <option value="D. Water & Plumbing">D. Water & Plumbing</option>
                <option value="E. Electrical, IT & A/V Equipment">
                  E. Electrical, IT & A/V Equipment
                </option>
                <option value="F. Building and Infrastructure">
                  F. Building and Infrastructure
                </option>
                <option value="G. Safety & Security">
                  G. Safety & Security
                </option>
                <option value="H. Events">H. Events</option>
                <option value="I. MIMO & Member Requests">
                  I. MIMO & Member Requests
                </option>
                <option value="J. Maintenance">J. Maintenance</option>
                <option value="K. Top Priority">K. Top Priority</option>
                <option value="M. Community">M. Community</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="form-label">Subcategory</label>
            <div className="select-wrapper">
              <select
                value={SubCategory}
                onChange={(e) => setSubCategory(e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select subcategory</option>
                {subCategoriesOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="form-label">Site</label>
            <div className="select-wrapper">
              <select
                value={Site}
                onChange={(e) => setSite(e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select site</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="form-label">Building</label>
            <div className="select-wrapper">
              <select
                value={Building}
                onChange={(e) => setBuilding(e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select building</option>
                <option value="A1">A1</option>
                <option value="A2">A2</option>
                <option value="B1">B1</option>
                <option value="B2">B2</option>
                <option value="C1">C1</option>
                <option value="C2">C2</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="form-label">Request Description</label>
            <textarea
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-textarea"
              placeholder="Describe the issue"
              required
            />
          </div>

          <button type="submit" className="submit-button">
            Submit Request
          </button>
        </form>

        {(sla || prediction !== null || predictedHours !== null) && (
          <div className="result-box">
            {sla && (
              <p className="result-text">
                <strong>SLA Time:</strong> {sla}
              </p>
            )}

            {predictedHours !== null && (
              <p className="result-text">
                <strong>Expected response time:</strong>{' '}
                {round(predictedHours, 2)} hours
              </p>
            )}

            {prediction !== null && (
              <div className="risk-container">
                {!!riskBucket && (
                  <RiskReveal
                    riskLevel={bucketLabel(riskBucket)}
                    color={bucketColor(riskBucket)}
                  />
                )}
                {recommendations.length > 0 && (
                  <ul className="recommendation-list">
                    {recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                )}
                {inconsistent && (
                  <p className="warning-text">
                    Warning, predicted hours and risk disagree, please review
                    assignment
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', minHeight: '400px', paddingLeft: '20%' }}>
            <Loading />
          </div>
        )}
      </div>
    </div>
  )
}

export default NewTicketForm
