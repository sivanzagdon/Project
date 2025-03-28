import React, { useState } from 'react'
import { TicketResponse, requestService } from '../../services/request.service'
import Loading from '../../components/Loading'

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response: TicketResponse = await requestService.createTicket({
        MainCategory,
        SubCategory,
        Building,
        Site,
        Description,
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
            options={[
              { value: '', label: 'Select subcategory' },
              { value: 'AC Issue', label: 'AC Issue' },
              { value: 'Add shelf/hook', label: 'Add shelf/hook' },
              { value: 'Air quality issue', label: 'Air quality issue' },
              { value: 'Bathroom maintenance', label: 'Bathroom maintenance' },
              { value: 'Broken glass', label: 'Broken glass' },
              { value: 'Broken/Loose socket', label: 'Broken/Loose socket' },
              { value: 'Cleaning required', label: 'Cleaning required' },
              { value: 'Construction noise', label: 'Construction noise' },
              { value: 'Curtains issue', label: 'Curtains issue' },
              { value: 'Damaged wall/ceiling', label: 'Damaged wall/ceiling' },
              {
                value: 'Door not closing/opening',
                label: 'Door not closing/opening',
              },
              { value: 'Electricity shutdown', label: 'Electricity shutdown' },
              {
                value: 'Equipment not working',
                label: 'Equipment not working',
              },
              {
                value: 'Extra furniture needed',
                label: 'Extra furniture needed',
              },
              { value: 'Fire alarm issue', label: 'Fire alarm issue' },
              { value: 'Flooring issue', label: 'Flooring issue' },
              {
                value: 'Furniture is broken/dirty',
                label: 'Furniture is broken/dirty',
              },
              { value: 'Glass cleaning', label: 'Glass cleaning' },
              { value: 'Handyman request', label: 'Handyman request' },
              { value: 'HVAC Issue', label: 'HVAC Issue' },
              { value: 'Internet not working', label: 'Internet not working' },
              {
                value: 'Kitchen appliance issue',
                label: 'Kitchen appliance issue',
              },
              { value: 'Lack of supplies', label: 'Lack of supplies' },
              { value: 'Leakage', label: 'Leakage' },
              { value: 'Lights not working', label: 'Lights not working' },
              { value: 'Maintenance noise', label: 'Maintenance noise' },
              { value: 'Mirror issue', label: 'Mirror issue' },
              { value: 'New member setup', label: 'New member setup' },
              { value: 'No/Slow Internet', label: 'No/Slow Internet' },
              { value: 'Office too cold/hot', label: 'Office too cold/hot' },
              { value: 'Other', label: 'Other' },
              { value: 'Paint scratches', label: 'Paint scratches' },
              { value: 'Painting request', label: 'Painting request' },
              {
                value: 'Projector/Screen issue',
                label: 'Projector/Screen issue',
              },
              { value: 'Remove items', label: 'Remove items' },
              { value: 'Repairs', label: 'Repairs' },
              { value: 'Replace lights', label: 'Replace lights' },
              {
                value: 'Replacing stock Printing paper/Coffee/Milk etc',
                label: 'Replacing stock Printing paper/Coffee/Milk etc',
              },
              { value: 'Sink clog', label: 'Sink clog' },
              { value: 'Storage issue', label: 'Storage issue' },
              { value: 'Table damaged', label: 'Table damaged' },
              { value: 'Temperature issue', label: 'Temperature issue' },
              { value: 'Toilet not working', label: 'Toilet not working' },
              { value: 'TV not working', label: 'TV not working' },
              { value: 'Wall needs fixing', label: 'Wall needs fixing' },
              { value: 'Water cooler issue', label: 'Water cooler issue' },
              { value: 'Water leak', label: 'Water leak' },
              { value: 'Window cracked', label: 'Window cracked' },
              {
                value: 'Window does not close/open',
                label: 'Window does not close/open',
              },
              { value: 'Wires exposed', label: 'Wires exposed' },
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
