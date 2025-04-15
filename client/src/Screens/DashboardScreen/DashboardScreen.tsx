import React, { useEffect, useState } from 'react'
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LineChart,
  Line,
  Legend,
} from 'recharts'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import {
  CombinedRateData,
  setDashboardData,
  setTimeData,
} from '../../redux/slices/dashboardSlice'
import { DashboardService } from '../../services/dashboard.service'
import Loading from '../../components/Loading'
import {
  calculateOpeningAndClosingRates,
  createCombinedData,
} from './dashboardUtils'

export interface TimeDataList {
  A: CombinedRateData[]
  B: CombinedRateData[]
  C: CombinedRateData[]
}

const dashboardService = new DashboardService()

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch()
  const data = useSelector((state: RootState) => state.dashboard.data)
  const timeData = useSelector((state: RootState) => state.dashboard.dataTimes)
  const lastFetching = useSelector(
    (state: RootState) => state.dashboard.lastFetched
  )
  const [selectedBuilding, setSelectedBuilding] = useState<'A' | 'B' | 'C'>('A')
  const [calculatedTimeData, setCalculatedTimeData] = useState<any>(null)
  const [combinedRateData, setCombinedRateData] = useState<TimeDataList>({
    A: [],
    B: [],
    C: [],
  })

  // First useEffect to handle dashboard data loading
  useEffect(() => {
    // Load dashboard data if it doesn't exist
    if (!data) {
      console.log('נתוני Dashboard לא קיימים ברידקס. נטען מחדש.')
      dashboardService
        .getDashboardData()
        .then((res) => {
          dispatch(setDashboardData(res))
        })
        .catch(console.error)
    }
  }, [dispatch, data])

  // Second useEffect to handle time data loading
  useEffect(() => {
    const currentTime = Date.now()

    // Load time data if it doesn't exist or it's stale (> 10 minutes)
    if (!timeData || currentTime - (lastFetching || 0) > 10 * 60 * 1000) {
      console.log('נתוני timeData לא קיימים או עברו 10 דקות. נטען מחדש.')
      dashboardService
        .getTimeData()
        .then((res) => {
          // Calculate rates based on the fetched data
          calculateOpeningAndClosingRates(
            res,
            selectedBuilding,
            setCalculatedTimeData,
            createCombinedData,
            setCombinedRateData
          )
          // Update Redux with the time data
          dispatch(setTimeData(res))
        })
        .catch(console.error)
    } else if (timeData && !calculatedTimeData) {
      // Use existing timeData if it exists but calculatedTimeData doesn't
      calculateOpeningAndClosingRates(
        timeData,
        selectedBuilding,
        setCalculatedTimeData,
        createCombinedData,
        setCombinedRateData
      )
    }
  }, [dispatch, timeData, lastFetching, selectedBuilding, calculatedTimeData])

  // Third useEffect to handle changes to selectedBuilding
  useEffect(() => {
    if (calculatedTimeData) {
      createCombinedData(calculatedTimeData, setCombinedRateData)
    }
  }, [selectedBuilding, calculatedTimeData])

  if (!data || !calculatedTimeData || !combinedRateData) return <Loading />

  const renderSiteGraphs = (site: 'A' | 'B' | 'C') => {
    const siteData = data[site]

    return (
      <>
        <h2 style={styles.sectionTitle}>{`${site} Opening & Closing Rates`}</h2>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={combinedRateData[selectedBuilding]}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              tickFormatter={(dateStr) => {
                const date = new Date(dateStr)
                return `${date.getDate()}/${date.getMonth() + 1}`
              }}
            />
            <YAxis
              label={{ value: 'Requests', angle: -90, position: 'insideLeft' }}
            />
            <Tooltip
              labelFormatter={(dateStr) =>
                `Date: ${new Date(dateStr).toLocaleDateString()}`
              }
              formatter={(value, name) => {
                const label =
                  name === 'opening_rate' ? 'Opening Rate' : 'Closing Rate'
                return [`${value} requests`, label]
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="opening_rate"
              stroke="#e37e7d"
              strokeWidth={2}
              name="Opening Rate"
              dot={false}
              activeDot={false}
            />
            <Line
              type="monotone"
              dataKey="closing_rate"
              stroke="#6e3635"
              strokeWidth={2}
              name="Closing Rate"
              dot={false}
              activeDot={false}
            />
          </LineChart>
        </ResponsiveContainer>

        <h2 style={styles.sectionTitle}>{`${site} SubCategory Breakdown`}</h2>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={siteData.sub_category}>
            <XAxis dataKey="subcategory" interval={0} tick={false} />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ef8885" />
          </BarChart>
        </ResponsiveContainer>

        <h2 style={styles.sectionTitle}>{`${site} Main Category Breakdown`}</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={siteData.main_category}>
            <XAxis
              dataKey="category"
              tickFormatter={(value) => value.charAt(0)}
              tick={{ fontSize: 14 }}
            />
            <YAxis />
            <Tooltip
              formatter={(value) => [`${value}`, 'Count']}
              labelFormatter={(category) => `Category: ${category}`}
            />
            <Bar dataKey="count" fill="#a02725" />
          </BarChart>
        </ResponsiveContainer>

        <h2 style={styles.sectionTitle}>{`${site} Requests by Weekday`}</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={siteData.by_weekday}>
            <XAxis dataKey="weekday" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ce332f" />
          </BarChart>
        </ResponsiveContainer>
      </>
    )
  }

  return (
    <div style={styles.container}>
      <div style={styles.dropdownWrapper}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="site-select-label">Select Site</InputLabel>
          <Select
            labelId="site-select-label"
            value={selectedBuilding}
            onChange={(e) =>
              setSelectedBuilding(e.target.value as 'A' | 'B' | 'C')
            }
            label="Select Site"
          >
            <MenuItem value="A">Site A</MenuItem>
            <MenuItem value="B">Site B</MenuItem>
            <MenuItem value="C">Site C</MenuItem>
          </Select>
        </FormControl>
      </div>

      {renderSiteGraphs(selectedBuilding)}
    </div>
  )
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    padding: '2rem',
    backgroundColor: '#FFFFFF',
    color: '#212121',
    borderRadius: '8px',
    boxShadow: '0px 4px 6px rgba(0,0,0,0.1)',
    fontFamily: "'Roboto', sans-serif",
    maxWidth: '1200px',
    margin: 'auto',
  },
  dropdownWrapper: {
    marginBottom: '20px',
  },
  sectionTitle: {
    marginTop: '3rem',
    fontSize: '1.5rem',
    color: '#212121',
    textAlign: 'center',
  },
}

export default DashboardPage
