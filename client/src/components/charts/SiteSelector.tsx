import React from 'react'
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material'

interface Props {
  selected: 'A' | 'B' | 'C'
  onChange: (value: 'A' | 'B' | 'C') => void
}

const SiteSelector: React.FC<Props> = ({ selected, onChange }) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <FormControl fullWidth variant="outlined">
        <InputLabel id="site-select-label">Select Site</InputLabel>
        <Select
          labelId="site-select-label"
          value={selected}
          onChange={(e) => onChange(e.target.value as 'A' | 'B' | 'C')}
          label="Select Site"
        >
          <MenuItem value="A">Site A</MenuItem>
          <MenuItem value="B">Site B</MenuItem>
          <MenuItem value="C">Site C</MenuItem>
        </Select>
      </FormControl>
    </div>
  )
}

export default SiteSelector
