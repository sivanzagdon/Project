import React, { useEffect, useState } from 'react'
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts' // Ensure proper imports from recharts
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../redux/store'
import { setDashboardData } from '../../redux/slices/dashboardSlice'
import { DashboardService } from '../../services/dashboard.service'
import Loading from '../../components/Loading'

const dashboardService = new DashboardService()

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch()
  const data = useSelector((state: RootState) => state.dashboard.data)
  const [selectedBuilding, setSelectedBuilding] = useState<'A' | 'B' | 'C'>('A')

  useEffect(() => {
    if (!data) {
      dashboardService
        .getDashboardData()
        .then((res) => {
          dispatch(setDashboardData(res))
        })
        .catch(console.error)
    }
  }, [dispatch, data])

  if (!data) return <Loading />

  const renderSiteGraphs = (site: 'A' | 'B' | 'C') => {
    const siteData = data[site]

    // Function to shorten text if it's too long
    const shortenText = (text: string) => {
      if (text.length > 10) {
        return text.slice(0, 10) + '...' // Cut the text to 10 characters and add "..."
      }
      return text
    }

    return (
      <>
        <h2>{`${site} Main Category Breakdown`}</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={siteData.main_category}>
            {/* Replace full names with A, B, C in order */}
            <XAxis
              dataKey="category"
              textAnchor="end"
              interval={0}
              height={100}
              tick={{ fontSize: 10 }}
              tickFormatter={(value, index) => {
                // Map categories to A, B, C
                const alphabet = [
                  'A',
                  'B',
                  'C',
                  'D',
                  'E',
                  'F',
                  'G',
                  'H',
                  'I',
                  'J',
                  'K',
                  'L',
                ]
                return alphabet[index] || value
              }}
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#007bff" />
          </BarChart>
        </ResponsiveContainer>

        <h2 style={{ marginTop: '3rem' }}>{`${site} SubCategory Breakdown`}</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={siteData.sub_category}>
            <XAxis
              dataKey="subcategory"
              interval={0}
              height={100}
              tick={false} // Remove the tick labels for SubCategory
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#00c49f" />
          </BarChart>
        </ResponsiveContainer>

        <h2 style={{ marginTop: '3rem' }}>{`${site} Requests by Weekday`}</h2>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={siteData.by_weekday}>
            <XAxis
              dataKey="weekday"
              height={100}
              tick={{ fontSize: 10 }}
              tickFormatter={shortenText} // Apply tickFormatter for shortening text
            />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#ff7300" />
          </BarChart>
        </ResponsiveContainer>
      </>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      {/* Dropdown for selecting site with Material UI */}
      <div style={{ marginBottom: '20px' }}>
        <FormControl fullWidth variant="outlined">
          <InputLabel id="site-select-label">Select Site</InputLabel>
          <Select
            labelId="site-select-label"
            value={selectedBuilding}
            onChange={(e) =>
              setSelectedBuilding(e.target.value as 'A' | 'B' | 'C')
            }
            label="Select Site"
            style={{ minWidth: 120 }}
          >
            <MenuItem value="A">Site A</MenuItem>
            <MenuItem value="B">Site B</MenuItem>
            <MenuItem value="C">Site C</MenuItem>
          </Select>
        </FormControl>
      </div>

      {/* Display the graphs for the selected site */}
      {renderSiteGraphs(selectedBuilding)}
    </div>
  )
}

export default DashboardPage
