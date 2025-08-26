import React from 'react'
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'

interface YearSelectorProps {
  selectedYear: '2023' | '2024'
  onChange: (year: '2023' | '2024') => void
}

// Dropdown selector component for choosing between different years (2023, 2024)
const YearSelector: React.FC<YearSelectorProps> = ({
  selectedYear,
  onChange,
}) => {
  const years: ('2023' | '2024')[] = ['2023', '2024']

  return (
    <div style={{ marginBottom: '20px' }}>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="year-select-label">Select Year</InputLabel>
        <Select
          labelId="year-select-label"
          value={selectedYear}
          onChange={(e) => onChange(e.target.value as '2023' | '2024')}
          label="Select Year"
        >
          {years.map((year) => (
            <MenuItem key={year} value={year}>
              {year}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  )
}

export default YearSelector
