export const calculateOpeningAndClosingRates = (
  data: any,
  selectedBuilding: 'A' | 'B' | 'C',
  setCalculatedTimeData: any,
  createCombinedData: any,
  setCombinedRateData: any
) => {
  const siteRates: {
    A: { opening_rate: any[]; closing_rate: any[] }
    B: { opening_rate: any[]; closing_rate: any[] }
    C: { opening_rate: any[]; closing_rate: any[] }
  } = {
    A: { opening_rate: [], closing_rate: [] },
    B: { opening_rate: [], closing_rate: [] },
    C: { opening_rate: [], closing_rate: [] },
  }

  // Process only the sites that have data
  for (const site in data) {
    if (data[site] && Array.isArray(data[site])) {
      const siteData = data[site]
      
      // Use Map for better performance with large datasets
      const openingDateCounts = new Map<string, number>()
      const closingDateCounts = new Map<string, number>()

      // Process opening dates
      for (const entry of siteData) {
        if (entry.created_on) {
          const dateStr = new Date(entry.created_on).toISOString().split('T')[0]
          openingDateCounts.set(dateStr, (openingDateCounts.get(dateStr) || 0) + 1)
        }
      }

      // Process closing dates
      for (const entry of siteData) {
        if (entry.closed_at) {
          const dateStr = new Date(entry.closed_at).toISOString().split('T')[0]
          closingDateCounts.set(dateStr, (closingDateCounts.get(dateStr) || 0) + 1)
        }
      }

      // Convert to arrays and sort
      const openingRates = Array.from(openingDateCounts.entries())
        .map(([date, count]) => ({ date, opening_rate: count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      const closingRates = Array.from(closingDateCounts.entries())
        .map(([date, count]) => ({ date, closing_rate: count }))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

      siteRates[site as keyof typeof siteRates] = {
        opening_rate: openingRates,
        closing_rate: closingRates
      }
    }
  }

  setCalculatedTimeData(siteRates)
  createCombinedData(siteRates, setCombinedRateData)
}

export const createCombinedData = (siteData: any, setCombinedRateData: any) => {
  const combinedData: { A: any[]; B: any[]; C: any[] } = {
    A: [],
    B: [],
    C: [],
  }

  for (const site in siteData) {
    if (site === 'A' || site === 'B' || site === 'C') {
      const siteSpecificData = siteData[site]
      if (!siteSpecificData) continue

      const { opening_rate, closing_rate } = siteSpecificData
      
      // Use Set for unique dates
      const allDates = new Set<string>()
      
      // Add all dates from both arrays
      opening_rate.forEach((item: any) => allDates.add(item.date))
      closing_rate.forEach((item: any) => allDates.add(item.date))

      // Convert to sorted array
      const sortedDates = Array.from(allDates).sort(
        (a, b) => new Date(a).getTime() - new Date(b).getTime()
      )

      // Create lookup maps for O(1) access
      const openingLookup = new Map<string, number>()
      const closingLookup = new Map<string, number>()

      opening_rate.forEach((item: any) => {
        openingLookup.set(item.date, item.opening_rate)
      })

      closing_rate.forEach((item: any) => {
        closingLookup.set(item.date, item.closing_rate)
      })

      // Combine data efficiently
      const combined = sortedDates.map((date) => ({
        date,
        opening_rate: openingLookup.get(date) || 0,
        closing_rate: closingLookup.get(date) || 0,
      }))

      combinedData[site as 'A' | 'B' | 'C'] = combined
    }
  }

  setCombinedRateData(combinedData)
}
