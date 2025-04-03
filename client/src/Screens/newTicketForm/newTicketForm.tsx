import React, { useState, useEffect } from 'react'
import { TicketResponse, requestService } from '../../services/request.service'
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
    <div dir="ltr" style={styles.page}>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>Create New Service Request</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <SelectInput
            label="Main Category"
            value={MainCategory}
            onChange={setMainCategory}
            options={[
              { value: '', label: 'Select category' },
              { value: 'A. Cleaning', label: 'A. Cleaning' },
              { value: 'B. Climate', label: 'B. Climate' },
              {
                value: 'C. Office & Kitchen & Printer Corner',
                label: 'C. Office & Kitchen & Printer Corner',
              },
              { value: 'D. Water & Plumbing', label: 'D. Water & Plumbing' },
              {
                value: 'E. Electrical, IT & A/V Equipment',
                label: 'E. Electrical, IT & A/V Equipment',
              },
              {
                value: 'F. Building and Infrastructure',
                label: 'F. Building and Infrastructure',
              },
              { value: 'G. Safety & Security', label: 'G. Safety & Security' },
              { value: 'H. Events', label: 'H. Events' },
              {
                value: 'I. MIMO & Member Requests',
                label: 'I. MIMO & Member Requests',
              },
              { value: 'J. Maintenance', label: 'J. Maintenance' },
              { value: 'K. Top Priority', label: 'K. Top Priority' },
              { value: 'M. Community', label: 'M. Community' },
            ]}
          />

          <SelectInput
            label="Subcategory"
            value={SubCategory}
            onChange={setSubCategory}
            options={subCategoriesOptions}
          />

          <SelectInput
            label="Site"
            value={Site}
            onChange={setSite}
            options={[
              { value: '', label: 'Select site' },
              { value: 'A', label: 'A' },
              { value: 'B', label: 'B' },
              { value: 'C', label: 'C' },
            ]}
          />

          <SelectInput
            label="Building"
            value={Building}
            onChange={setBuilding}
            options={[
              { value: '', label: 'Select building' },
              { value: 'A1', label: 'A1' },
              { value: 'A2', label: 'A2' },
              { value: 'B1', label: 'B1' },
              { value: 'B2', label: 'B2' },
              { value: 'C1', label: 'C1' },
              { value: 'C2', label: 'C2' },
            ]}
          />

          <div style={styles.inputGroup}>
            <label style={styles.label}>Request Description</label>
            <textarea
              value={Description}
              onChange={(e) => setDescription(e.target.value)}
              style={styles.textarea}
              placeholder="Describe the issue"
              required
            />
          </div>

          <button type="submit" style={styles.button}>
            Submit Request
          </button>
        </form>

        {(sla || prediction !== null) && (
          <div style={styles.resultBox}>
            {sla && (
              <p style={styles.resultText}>
                <strong>SLA Time:</strong> {sla}
              </p>
            )}

            {prediction !== null && (
              <div style={styles.riskContainer}>
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
                  <ul style={styles.recommendationList}>
                    {recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {expectedTime !== null && (
              <p style={styles.resultText}>
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

interface SelectInputProps {
  label: string
  value: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
}

const SelectInput: React.FC<SelectInputProps> = ({
  label,
  value,
  onChange,
  options,
}) => (
  <div style={styles.inputGroup}>
    <label style={styles.label}>{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={styles.input}
      required
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
)

const styles: Record<string, React.CSSProperties> = {
  page: {
    backgroundColor: '#f4f4f4',
    minHeight: '100vh',
    padding: '40px 20px',
  },
  formContainer: {
    maxWidth: '600px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    padding: '30px',
    borderRadius: '12px',
    boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
    border: '1px solid #ddd',
  },
  header: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '24px',
    color: '#1a1a1a',
    textAlign: 'center',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    marginBottom: '6px',
    fontWeight: 500,
    color: '#2f2f2f',
  },
  input: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  textarea: {
    padding: '10px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '16px',
    minHeight: '100px',
    resize: 'vertical',
  },
  button: {
    backgroundColor: '#007bff',
    color: '#fff',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 600,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
  },
  resultBox: {
    marginTop: '30px',
    backgroundColor: '#2f2f2f',
    padding: '16px',
    borderRadius: '10px',
    color: '#fff',
  },
  resultText: {
    fontSize: '16px',
    marginBottom: '8px',
  },
  recommendationList: {
    paddingRight: '20px',
    marginTop: '10px',
    listStyle: 'disc',
    fontSize: '15px',
    color: '#e0e0e0',
  },
}

export default NewTicketForm
