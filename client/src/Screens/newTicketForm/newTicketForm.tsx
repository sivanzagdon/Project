import React, { useState } from 'react'
import { TicketResponse, requestService } from '../../services/request.service'
import Loading from '../../components/Loading'

const NewTicketForm: React.FC = () => {
  const [mainCategory, setMainCategory] = useState('')
  const [subCategory, setSubCategory] = useState('')
  const [building, setBuilding] = useState('')
  const [site, setSite] = useState('')
  const [description, setDescription] = useState('')
  const [sla, setSla] = useState('')
  const [prediction, setPrediction] = useState<number | null>(null)
  const [recommendations, setRecommendations] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response: TicketResponse = await requestService.createTicket({
        mainCategory,
        subCategory,
        building,
        site,
        description,
      })

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

  return (
    <div dir="ltr" style={styles.page}>
      <div style={styles.formContainer}>
        <h2 style={styles.header}>Create New Service Request</h2>

        <form onSubmit={handleSubmit} style={styles.form}>
          <SelectInput
            label="Main Category"
            value={mainCategory}
            onChange={setMainCategory}
            options={[
              { value: '', label: 'Select category' },
              { value: 'Cleaning', label: 'Cleaning' },
              { value: 'Electricity', label: 'Electricity' },
              { value: 'Plumbing', label: 'Plumbing' },
            ]}
          />

          <SelectInput
            label="Subcategory"
            value={subCategory}
            onChange={setSubCategory}
            options={[
              { value: '', label: 'Select subcategory' },
              { value: 'Lights', label: 'Lights' },
              { value: 'Leaks', label: 'Leaks' },
              { value: 'BrokenDevice', label: 'Broken device' },
            ]}
          />

          <SelectInput
            label="Building"
            value={building}
            onChange={setBuilding}
            options={[
              { value: '', label: 'Select building' },
              { value: 'B1', label: 'B1' },
              { value: 'C1', label: 'C1' },
              { value: 'C2', label: 'C2' },
            ]}
          />

          <SelectInput
            label="Site"
            value={site}
            onChange={setSite}
            options={[
              { value: '', label: 'Select site' },
              { value: 'A', label: 'A' },
              { value: 'B', label: 'B' },
              { value: 'C', label: 'C' },
            ]}
          />

          <div style={styles.inputGroup}>
            <label style={styles.label}>Request Description</label>
            <textarea
              value={description}
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
              <>
                <p style={styles.riskText}>
                  {Math.round(prediction * 100)}% Risk of Breach
                </p>
                {recommendations.length > 0 && (
                  <ul style={styles.recommendationList}>
                    {recommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                )}
              </>
            )}
            {/* {isLoading && <Loading />} */}
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
    color: '#2f2f2f', // כמו הטקסט ב-sidebar
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
    backgroundColor: '#2f2f2f', // כהה כמו sidebar
    padding: '16px',
    borderRadius: '10px',
    color: '#fff',
  },
  resultText: {
    fontSize: '16px',
    marginBottom: '8px',
  },
  riskText: {
    fontSize: '18px',
    fontWeight: 600,
    color: '#ff6b6b',
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
