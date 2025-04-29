import React, { useState, useEffect } from 'react'
import { requestService } from '../../services/request.service'
import { TicketResponse } from '../../types/request.type'
import Loading from '../../components/Loading'
import './NewTicketForm.css'
import RiskReveal from '../../components/RiskReveal'

const NewTicketForm: React.FC = () => {
  const [MainCategory, setMainCategory] = useState('')
  const [SubCategory, setSubCategory] = useState('')
  const [Building, setBuilding] = useState('')
  const [Site, setSite] = useState('')
  const [Description, setDescription] = useState('')
  const [sla, setSla] = useState('')
  const [prediction, setPrediction] = useState<number | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [expectedTime, setExpectedTime] = useState<number | null>(null)
  const [categoriesData, setCategoriesData] = useState<any>({})
  const [subCategoriesOptions, setSubCategoriesOptions] = useState<
    { value: string; label: string }[]
  >([])

  // Fetch categories from the JSON file located in public folder
  useEffect(() => {
    fetch('/data.json')
      .then((response) => response.json())
      .then((data) => setCategoriesData(data))
      .catch((error) => console.error('Error loading categories data:', error))
  }, [])

  // Update subcategories options when main category changes
  useEffect(() => {
    if (MainCategory && categoriesData[MainCategory]) {
      const subCategories = categoriesData[MainCategory].map(
        (subCat: string) => ({
          value: subCat,
          label: subCat,
        })
      )
      setSubCategoriesOptions(subCategories)

      if (subCategories.length === 0) {
        setSubCategory('')
      }
    }
  }, [MainCategory, categoriesData])

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
      const expected = await requestService.predictExpectedResponseTime(
        ticketData
      )
      setExpectedTime(expected)

      const response: TicketResponse = await requestService.createTicket(
        ticketData
      )
      const { sla_time, risk_score, recommendations } = response

      setSla(`${sla_time} Hours`)
      setPrediction(risk_score)
      setRecommendations(recommendations || [])
    } catch (error) {
      console.error('Adding a request failed', error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRiskLevel = (score: number): string => {
    if (score < 0.4) return 'Low Risk'
    if (score < 0.7) return 'Medium Risk'
    return 'High Risk'
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

        {(sla || prediction !== null) && (
          <div className="result-box">
            {sla && (
              <p className="result-text">
                <strong>SLA Time:</strong> {sla}
              </p>
            )}

            {prediction !== null && (
              <div className="risk-container">
                <RiskReveal
                  riskLevel={getRiskLevel(prediction)}
                  color={
                    prediction < 0.4
                      ? 'green'
                      : prediction < 0.7
                      ? 'orange'
                      : 'red'
                  }
                />
                {recommendations.length > 0 && (
                  <ul className="recommendation-list">
                    {recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {expectedTime !== null && (
              <p className="result-text">
                <strong>Expected response time:</strong>{' '}
                {expectedTime.toFixed(2)} hours
              </p>
            )}
          </div>
        )}
        {isLoading && <Loading />}
      </div>
    </div>
  )
}

export default NewTicketForm
