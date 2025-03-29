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
  const [expectedTime, setExpectedTime] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
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
              {
                value: 'Access App is not working',
                label: 'Access App is not working',
              },
              {
                value: 'Access Card/Tag/Key does not work',
                label: 'Access Card/Tag/Key does not work',
              },
              { value: 'Accounting requests', label: 'Accounting requests' },
              { value: 'Add/Remove Furniture', label: 'Add/Remove Furniture' },
              {
                value:
                  'Appliance is broken Dishwasher/Coffee Machine/Fridge etc.',
                label:
                  'Appliance is broken Dishwasher/Coffee Machine/Fridge etc.',
              },
              {
                value: 'Arrange Community Event',
                label: 'Arrange Community Event',
              },
              { value: 'Arrange Host Event', label: 'Arrange Host Event' },
              {
                value: 'Audio Visual equipment does not work',
                label: 'Audio Visual equipment does not work',
              },
              {
                value: 'Bad smell from air conditioner',
                label: 'Bad smell from air conditioner',
              },
              {
                value: 'Blinds are not working/Caged',
                label: 'Blinds are not working/Caged',
              },
              {
                value: 'Blinds are not working/damaged',
                label: 'Blinds are not working/damaged',
              },
              { value: 'Booking event spaces', label: 'Booking event spaces' },
              { value: 'CCTV', label: 'CCTV' },
              { value: 'Catering', label: 'Catering' },
              { value: 'Clean gutters', label: 'Clean gutters' },
              {
                value: 'Cleaning needed in Event Space',
                label: 'Cleaning needed in Event Space',
              },
              {
                value: 'Cleaning needed in Lounge',
                label: 'Cleaning needed in Lounge',
              },
              {
                value: 'Cleaning needed in Meeting Room',
                label: 'Cleaning needed in Meeting Room',
              },
              {
                value: 'Cleaning needed in Office',
                label: 'Cleaning needed in Office',
              },
              {
                value: 'Cleaning needed in another Area',
                label: 'Cleaning needed in another Area',
              },
              {
                value: 'Clear up Community Event',
                label: 'Clear up Community Event',
              },
              { value: 'Clear up Host Event', label: 'Clear up Host Event' },
              { value: 'Clogged Toilet/Sink', label: 'Clogged Toilet/Sink' },
              {
                value: 'Cold/Carbonized Water tap does not work',
                label: 'Cold/Carbonized Water tap does not work',
              },
              {
                value: 'Connect with sales team',
                label: 'Connect with sales team',
              },
              {
                value: 'Create/Duplicate Access Cards/Tags/keys',
                label: 'Create/Duplicate Access Cards/Tags/keys',
              },
              { value: 'Deep Cleaning', label: 'Deep Cleaning' },
              {
                value: 'Different Access System',
                label: 'Different Access System',
              },
              {
                value: 'Door does not close/open',
                label: 'Door does not close/open',
              },
              {
                value: 'Electricity socket does not work',
                label: 'Electricity socket does not work',
              },
              {
                value: 'Elevator does not work',
                label: 'Elevator does not work',
              },
              { value: 'Emergency Lighting', label: 'Emergency Lighting' },
              {
                value: 'Extra cleaning post Community Event',
                label: 'Extra cleaning post Community Event',
              },
              {
                value: 'Extra cleaning post Host Event',
                label: 'Extra cleaning post Host Event',
              },
              {
                value: 'Faulty air conditioner',
                label: 'Faulty air conditioner',
              },
              { value: 'Fire Alarm System', label: 'Fire Alarm System' },
              {
                value: 'Fire safety equipment broken/missing',
                label: 'Fire safety equipment broken/missing',
              },
              { value: 'Floor is Caged', label: 'Floor is Caged' },
              { value: 'Floor is damaged', label: 'Floor is damaged' },
              {
                value: 'Furniture is broken/dirty',
                label: 'Furniture is broken/dirty',
              },
              {
                value: 'Garden/Terrace plants & weeds',
                label: 'Garden/Terrace plants & weeds',
              },
              { value: 'General Power outage', label: 'General Power outage' },
              { value: 'Graffiti removal', label: 'Graffiti removal' },
              { value: 'Guests', label: 'Guests' },
              {
                value: 'Gym access (Applicable to certain sites only)',
                label: 'Gym access (Applicable to certain sites only)',
              },
              {
                value: 'Heating does not work',
                label: 'Heating does not work',
              },
              { value: 'IT Setup', label: 'IT Setup' },
              { value: 'Installation', label: 'Installation' },
              {
                value: 'Intercom does not work',
                label: 'Intercom does not work',
              },
              {
                value: 'Internet port does not work',
                label: 'Internet port does not work',
              },
              {
                value: 'Kitchen cabinets are broken',
                label: 'Kitchen cabinets are broken',
              },
              { value: 'Leakage', label: 'Leakage' },
              {
                value: 'Leaking air conditioner',
                label: 'Leaking air conditioner',
              },
              { value: 'Light does not work', label: 'Light does not work' },
              {
                value: 'Lighting Strike Prevention System',
                label: 'Lighting Strike Prevention System',
              },
              { value: 'Local Power outage', label: 'Local Power outage' },
              {
                value: 'Lock battery needs replacing',
                label: 'Lock battery needs replacing',
              },
              {
                value: 'Lock/Access Point does not work',
                label: 'Lock/Access Point does not work',
              },
              { value: 'Logo request', label: 'Logo request' },
              {
                value: 'Lost Access Card/Tag/Key',
                label: 'Lost Access Card/Tag/Key',
              },
              { value: 'Lost card / Lost key', label: 'Lost card / Lost key' },
              {
                value: 'Marketing Screen does not work',
                label: 'Marketing Screen does not work',
              },
              {
                value: 'Member modification (add/remove)',
                label: 'Member modification (add/remove)',
              },
              {
                value: 'Mindspace App does not work',
                label: 'Mindspace App does not work',
              },
              { value: 'Mindspace events', label: 'Mindspace events' },
              { value: 'No (hot) water', label: 'No (hot) water' },
              { value: 'No Power', label: 'No Power' },
              { value: 'No/Slow Internet', label: 'No/Slow Internet' },
              { value: 'No/Slow WiFi', label: 'No/Slow WiFi' },
              {
                value: 'Noisy air conditioner',
                label: 'Noisy air conditioner',
              },
              { value: 'Open locker', label: 'Open locker' },
              { value: 'Packages & Mail', label: 'Packages & Mail' },
              { value: 'Painting', label: 'Painting' },
              { value: 'Painting request', label: 'Painting request' },
              { value: 'Paintwork is Caged', label: 'Paintwork is Caged' },
              { value: 'Paintwork is damaged', label: 'Paintwork is damaged' },
              {
                value: 'Parking issues (Applicable to certain sites only)',
                label: 'Parking issues (Applicable to certain sites only)',
              },
              { value: 'Pest control', label: 'Pest control' },
              {
                value: 'Power/AV cables missing',
                label: 'Power/AV cables missing',
              },
              {
                value: 'Printer does not work',
                label: 'Printer does not work',
              },
              {
                value:
                  'Questions reg. Membership (e.g. accessing other locations)',
                label:
                  'Questions reg. Membership (e.g. accessing other locations)',
              },
              { value: 'Repairs', label: 'Repairs' },
              {
                value: 'Replacing stock Printing paper/Coffee/Milk etc.',
                label: 'Replacing stock Printing paper/Coffee/Milk etc.',
              },
              {
                value: 'Request for a personal meeting',
                label: 'Request for a personal meeting',
              },
              { value: 'Restroom', label: 'Restroom' },
              { value: 'Roof', label: 'Roof' },
              { value: 'Signage', label: 'Signage' },
              {
                value: 'Ventilation does not work',
                label: 'Ventilation does not work',
              },
              { value: 'Very urgent fix', label: 'Very urgent fix' },
              { value: 'Water pressure low', label: 'Water pressure low' },
              {
                value: 'Window does not close/open',
                label: 'Window does not close/open',
              },
              {
                value: 'Window/Door glass is broken',
                label: 'Window/Door glass is broken',
              },
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
